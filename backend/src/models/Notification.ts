import Sequelize, {Model} from "sequelize";

interface NotificationAttributes {
  id: number;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Notification extends Model<NotificationAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiverUserId',
      });
    }
  }

  Notification.init({
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
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    message: {
      type: DataTypes.STRING,
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
    tableName: "Notification",
    modelName: 'Notification'
  });

  return Notification;
};