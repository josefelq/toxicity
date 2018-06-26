const mongoose = require('mongoose');
const { Schema } = mongoose;

//type: false if its toxicity, true if griefing
const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Suspect' },
  text: String,
  votes: Number,
  date: Date
});

mongoose.model('Comment', commentSchema);