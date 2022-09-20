const mongoose = require('mongoose');

const tokenSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    require: true,
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
