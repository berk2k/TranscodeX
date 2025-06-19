const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VideoMetadata = sequelize.define('VideoMetadata', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  video_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  duration: {
    type: DataTypes.FLOAT, // seconds
    allowNull: false
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  codec: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER, //byte 
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'video_metadata',
  timestamps: false
});

module.exports = VideoMetadata;
