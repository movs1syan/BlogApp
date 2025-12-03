import Sequelize, { type DataTypes, Model, type Optional } from 'sequelize';

export interface PostAttributes {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string | null;
  userId: number;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

export default function (sequelize: any, DataTypes: typeof Sequelize.DataTypes) {
  class Post extends Model<PostAttributes, PostCreationAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "author"
      });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    },
    {
      sequelize, // required
      tableName: "Posts",
      modelName: "Post",
    }
  );

  return Post;
}