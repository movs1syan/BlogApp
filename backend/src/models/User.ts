import Sequelize, { Model, type Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  avatar: string | null;
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

      this.belongsToMany(models.User, {
        through: "Follows",
        as: "followers",
        foreignKey: "followingId",
        otherKey: "followerId",
      });

      this.belongsToMany(models.User, {
        through: "Follows",
        as: "pending",
        foreignKey: "followerId",
        otherKey: "followingId",
      });

      this.belongsToMany(models.User, {
        through: "Follows",
        as: "following",
        foreignKey: "followerId",
        otherKey: "followingId",
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
    },
    {
      sequelize, // required
      tableName: "Users",
      modelName: "User",
    }
  );

  return User;
}