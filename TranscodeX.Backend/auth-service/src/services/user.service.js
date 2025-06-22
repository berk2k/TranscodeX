const bcrypt = require('bcrypt');
const { generateToken } = require('./auth.service');
const User = require('../models/user.model');
const { Op } = require('sequelize');

const createUser = async (username, email, password) => {
    try {
        const existingUser = await findByEmailOrUsername(username) || await findByEmailOrUsername(email);
        if (existingUser) {
            throw new Error('Username or email already in use.');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            passwordHash,
        });

        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

const loginUser = async ({ identifier, password }) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      throw new Error('Invalid email/username or password.');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('Invalid email/username or password.');
    }

    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = generateToken(payload, '1h');

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error('Login failed: ' + error.message);
  }
};

const findByEmailOrUsername = async (identifier) => {
  return await User.findOne({
    where: {
      [Op.or]: [
        { email: identifier },
        { username: identifier }
      ]
    }
  });
};

const findById = async (id) => {
    try {
        return await User.findByPk(id);
    } catch (error) {
        throw new Error('Error finding user: ' + error.message);
    }
};

const verifyPassword = async (user, plainPassword) => {
    try {
        return await bcrypt.compare(plainPassword, user.passwordHash);
    } catch (error) {
        throw new Error('Password invalid: ' + error.message);
    }
};

module.exports = {
  createUser,
  loginUser,
  findByEmailOrUsername,
  findById,
  verifyPassword,
};
