import { DataTypes, Model, type Optional } from "sequelize"
import { sequelize } from "../db.ts";

interface UserAttributes {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}
export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export const User = sequelize.define<UserInstance>("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
});