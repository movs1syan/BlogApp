import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.ts";
import {
  createUserService,
  getUserProfileService,
  getUserService,
  changeUserPassService,
  updateUserService, resetUserPassService
} from "../services/userService.ts";
import { transporter } from "../utils/nodemailer.ts";
import * as crypto from "node:crypto";
import {User, Friend} from "../models/models.ts";
import {Op} from "sequelize";

export const registerUser = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;
  const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

  try {
    const userExists = await getUserService(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await createUserService(name, surname, email, password, avatarPath);
    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    return res.status(201).json({ token: generateToken(newUser.id) });
  } catch (error) {
    res.status(500).json({ message: `Registration failed: ${error}` });
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await getUserService(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({ token: generateToken(user.id) })
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: `Authentication failed: ${error}` });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await getUserService(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
      `,
    });

    return res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token) return res.status(400).json({ message: "Token is required" });

  try {
    await resetUserPassService(token, newPassword);

    return res.json({ message: "Password successfully updated" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  const user = req.user;

  try {
    if (user && (await bcrypt.compare(password, user.password))) {
      await changeUserPassService(newPassword, confirmNewPassword, user);

      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, surname } = req.body;
  const user = req.user;
  const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

  try {
    const updatedUser = await updateUserService(name, surname, avatarPath, user);

    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ message: `Failed to update user: ${err}` });
  }

};

export const getUserInfo = async (req: Request, res: Response) => {
  const { id, name, surname, email, avatar } = req.user;

  return res.status(200).json({ id, name, surname, email, avatar});
};

export const getUserProfile = async (req: Request, res: Response) => {
  const user = await getUserProfileService(req.user.id);

  return res.status(200).json(user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const userSearch = String(req.query.userSearch || "");

  const offset = (page - 1) * limit;

  const searchFilter = userSearch ? {
    [Op.or]: [
      { name: { [Op.iLike]: `%${userSearch}%` } },
      { surname: { [Op.iLike]: `%${userSearch}%` } },
      { email: { [Op.iLike]: `%${userSearch}%` } },
    ]
  } : {};

  try {
    const { count: totalUsersQuantity, rows: users } = await User.findAndCountAll({
      where: {
        ...searchFilter,
        id: { [Op.ne]: req.user.id },
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "surname", "email", "avatar"],
    });

    if (offset > totalUsersQuantity) {
      throw new Error(`Page ${page} not found`);
    }

    return res.status(200).json({ totalUsersQuantity, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const sendRequest = async (req: Request, res: Response) => {
  const reqSenderId = req.user.id;
  const reqTakerId = Number(req.body.id);

  try {
    if (reqSenderId === reqTakerId) {
      return res.status(400).json({ message: "You cannot send friend request to you" });
    }

    const existing = await Friend.findOne({
      where: { reqSenderId, reqTakerId }
    });

    if (existing) {
      if (existing.status === "pending") {
        return res.status(400).json({ message: "Request already sent" });
      }
      if (existing.status === "accepted") {
        return res.status(400).json({ message: "Already friends" });
      }
    }

    await Friend.create({ reqSenderId, reqTakerId, status: "pending" });

    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  const reqTakerId = req.user.id;
  const reqSenderId = Number(req.body.id);

  try {
    const friends = await Friend.findOne({
      where: { reqSenderId, reqTakerId, status: "pending" }
    });

    if (!friends) {
      return res.status(400).json({ message: "Friend request not found" });
    }

    friends.status = "accepted";
    await friends.save();

    await Friend.create({
      reqSenderId: reqTakerId,
      reqTakerId: reqSenderId,
      status: "accepted",
    });

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const declineRequest = async (req: Request, res: Response) => {
  try {
    const reqTakerId = req.user.id;
    const reqSenderId = Number(req.body.id);

    const friends = await Friend.findOne({
      where: {
        reqSenderId,
        reqTakerId,
        status: "pending"
      }
    });

    if (!friends) return res.status(404).json({ message: "Request not found" });

    await friends.destroy();

    res.json({ message: "Request declined" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
};

export const unfriendUser = async (req: Request, res: Response) => {
  try {
    const reqSenderId = req.user.id;
    const reqTakerId = Number(req.body.id);

    const friends1 = await Friend.findOne({
      where: { reqSenderId, reqTakerId, status: "accepted" }
    });

    const friends2 = await Friend.findOne({
      where: { reqTakerId: reqSenderId, reqSenderId: reqTakerId, status: "accepted" }
    })

    if (!friends1 && !friends2) {
      return res.status(400).json({ message: "You and this user are not friends" });
    }

    await friends1.destroy();
    await friends2.destroy();

    return res.json({ message: "Unfriended successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: User,
        as: "followers",
        attributes: ["name", "surname", "email", "avatar"],
        through: { attributes: [], where: { status: "accepted" } },
      }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.followers);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getFollowings = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: User,
        as: "following",
        attributes: ["name", "surname", "email", "avatar"],
        through: { attributes: [], where: { status: "accepted" } },
      }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.following);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getUserWithFriends = async (req: Request, res: Response) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: User,
          as: "friends",
          attributes: ["id", "name", "surname", "email", "avatar"],
          through: { attributes: [], where: { status: "accepted" } }
        },
        {
          model: User,
          as: "pendingToBeAccepted",
          attributes: ["id", "name", "surname", "email", "avatar"],
          through: { attributes: [], where: { status: "pending" } }
        },
        {
          model: User,
          as: "pendingToAccept",
          attributes: ["id", "name", "surname", "email", "avatar"],
          through: { attributes: [], where: { status: "pending" } }
        }
      ],
      attributes: { exclude: ["password", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};