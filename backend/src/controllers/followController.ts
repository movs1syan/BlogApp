import type { Request, Response } from "express";
import { User, Follows } from "../models/models.ts";

export const sendFollow = async (req: Request, res: Response) => {
  const followerId = req.user.id;
  const followingId = Number(req.body.id);

  try {
    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existing = await Follows.findOne({
      where: { followerId, followingId }
    });

    if (existing) {
      if (existing.status === "pending") {
        return res.status(400).json({ message: "Request already sent" });
      }
      if (existing.status === "accepted") {
        return res.status(400).json({ message: "Already following" });
      }
    }

    await Follows.create({ followerId, followingId, status: "pending" });

    return res.status(200).json({ message: "Follow request sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const acceptFollow = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const followerId = Number(req.body.id);

  try {
    const follow = await Follows.findOne({
      where: {
        followerId,
        followingId: userId,
        status: "pending"
      }
    });

    if (!follow) {
      return res.status(400).json({ message: "Follow request not found" });
    }

    follow.status = "accepted";
    await follow.save();

    return res.status(200).json({ message: "Follow request accepted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const declineFollow = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const followerId = Number(req.body.id);

    const follow = await Follows.findOne({
      where: {
        followerId,
        followingId: userId,
        status: "pending"
      }
    });

    if (!follow) return res.status(404).json({ message: "Request not found" });

    await follow.destroy();

    res.json({ message: "Request declined" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.user.id;
    const followingId = Number(req.body.id);

    const alreadyFollowing = await Follows.findOne({
      where: { followerId, followingId, status: "accepted" }
    });

    if (!alreadyFollowing) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    await alreadyFollowing.destroy();

    return res.json({ message: "Unfollowed successfully" });
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