import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from "../db.ts";

interface PostAttributes {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string | null;
  userId: number;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}
export interface PostInstance extends Model<PostAttributes, PostCreationAttributes>, PostAttributes {}

export const Post = sequelize.define<PostInstance>("Post", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }
},
{
  timestamps: true,
});