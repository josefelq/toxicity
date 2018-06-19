const mongoose = require('mongoose');
const { Schema } = mongoose;

const suspectSchema = new Schema({
  steamId: String,
  votes: Number,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model('Suspect', suspectSchema);
