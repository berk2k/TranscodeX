const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Upload = sequelize.define('Upload', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storage_key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'uploads',
  timestamps: false,
});

module.exports = Upload;
