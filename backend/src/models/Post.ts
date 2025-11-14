import { DataTypes } from 'sequelize';
import { sequelize } from "../db.ts";

export const Post = sequelize.define("Post", {
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  post_pic: { type: DataTypes.STRING },
  author_name: { type: DataTypes.STRING, allowNull: false },
  author_surname: { type: DataTypes.STRING, allowNull: false },
  author_pic: { type: DataTypes.STRING }
  },
  {
    timestamps: true,
  }
);