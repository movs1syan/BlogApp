import { DataTypes } from 'sequelize';
import { sequelize } from "../db.ts";

export const Post = sequelize.define("Post", {
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  postImage: { type: DataTypes.STRING },
  authorName: { type: DataTypes.STRING, allowNull: false },
  authorSurname: { type: DataTypes.STRING, allowNull: false },
  authorImage: { type: DataTypes.STRING }
},
{
  timestamps: true,
});