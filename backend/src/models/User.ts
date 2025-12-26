import Sequelize, { Model, type Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  avatar: string | null;
  stripeCustomerId: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}
export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class User extends Model<UserAttributes, UserCreationAttributes> {
    static associate(models: any) {
      this.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
      });

      this.hasMany(models.Notification, {
        foreignKey: "receiverId",
        as: "notifications"
      });

      this.hasMany(models.Message, {
        foreignKey: "receiverId",
        as: "receivedMessages"
      });

      this.hasMany(models.Message, {
        foreignKey: "senderId",
        as: "sentMessages"
      });

      this.hasMany(models.Group, {
        foreignKey: "adminId",
        as: "createdGroups"
      });

      this.hasMany(models.GroupMessage, {
        foreignKey: "senderId",
        as: "groupMessages"
      });

      this.hasMany(models.Product, {
        foreignKey: "userId",
        as: "products"
      });

      this.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });

      this.hasMany(models.CartItem, {
        foreignKey: 'userId',
        as: 'cartItems'
      });

      this.belongsToMany(models.Group, {
        through: "GroupUsers",
        foreignKey: "userId",
        as: "groups"
      });

      this.belongsToMany(models.User, {
        through: "Friends",
        as: "friends",
        foreignKey: "reqTakerId",
      });

      this.belongsToMany(models.User, {
        through: "Friends",
        as: "pendingToBeAccepted",
        foreignKey: "reqSenderId",
      });

      this.belongsToMany(models.User, {
        through: "Friends",
        as: "pendingToAccept",
        foreignKey: "reqTakerId",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize, // required
      tableName: "Users",
      modelName: "User",
    }
  );

  return User;
}