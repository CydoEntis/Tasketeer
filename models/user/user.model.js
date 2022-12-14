const mongoose = require('mongoose');
const { NUMBER } = require('sequelize');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user"
  }
  // resetToken: String,
  // resetTokenExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);
