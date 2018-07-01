const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  suspect: { type: Schema.Types.ObjectId, ref: 'Suspect' },
  text: String,
  participants: [{ type: String }],
  date: Date
});

mongoose.model('Comment', commentSchema);
