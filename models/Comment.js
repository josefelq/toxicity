const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  text: String,
  participants: [{ type: String }],
  date: Date
});

mongoose.model('Comment', commentSchema);
