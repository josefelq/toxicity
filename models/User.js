const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  steamId: String,
  suspect: { type: Schema.Types.ObjectId, ref: 'Suspect' }
});

mongoose.model('users', userSchema);
