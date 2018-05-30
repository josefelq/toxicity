const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  steamId: String
});

mongoose.model('users', userSchema);
