const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  text: String,
  votes: Number,
  participants: [{ type: String }],
  date: Date
});

mongoose.model('Comment', commentSchema);
