const mongoose = require('mongoose');
const { Schema } = mongoose;

const suspectSchema = new Schema({
  steamId: String,
  steamName: String,
  steamAvatar: String,
  votes: [{ type: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model('Suspect', suspectSchema);
