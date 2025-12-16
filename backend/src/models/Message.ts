import Sequelize, { Model } from 'sequelize';

interface MessageAttributes {
  id: number,
  senderId: number,
  receiverId: number,
  message: string,
  isRead: boolean,
  createdAt: Date,
  updatedAt: Date,
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Message extends Model<MessageAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender"
      });

      this.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver"
      });
    }
  }

  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'Messages',
    modelName: 'Message',
  });

  return Message;
};