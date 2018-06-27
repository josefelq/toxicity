const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  ownerSteam: String,
  text: String,
  votes: Number,
  participants: [{ type: String }],
  date: Date
});

mongoose.model('Comment', commentSchema);
