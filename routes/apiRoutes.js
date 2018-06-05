const mongoose = require('mongoose');
const steam = require('steam-web');
const keys = require('../config/keys');

const steamid = require('steamidconvert')(keys.steamWebAPIKey);
const steamAPI = new steam({
  apiKey: keys.steamWebAPIKey,
  format: 'json' //optional ['json', 'xml', 'vdf']
});

const User = mongoose.model('users');
const Suspect = mongoose.model('Suspect');
const Comment = mongoose.model('Comment');

module.exports = app => {
  //Get Suspect info
  app.get('/api/suspects/:steamId', async (req, res) => {
    let data = false;
    const theSuspect = await Suspect.findOne({
      steamId: req.params.steamId
    }).populate('comments');
    if (theSuspect) {
      data = theSuspect;
    }
    res.send(data);
  });

  //Create a suspect
  app.post('/api/suspects', async (req, res) => {
    let someData = false;
    //check if steamID is number
    const isNum = /^\d+$/.test(req.body.steamId);
    //check if it's a valid steam user
    steamAPI.getPlayerSummaries({
      steamids: [req.body.steamId],
      callback: async (err, data) => {
        if (data.response.players.length != 0 && isNum) {
          const checkSuspect = await Suspect.findOne({
            steamId: req.body.steamId
          });
          if (!checkSuspect) {
            const newSuspect = await new Suspect({
              steamId: req.body.steamId,
              toxicReports: 0,
              griefReports: 0
            }).save();
            const updateUser = await User.findOneAndUpdate(
              { steamId: req.body.steamId },
              { suspect: newSuspect._id },
              { new: true }
            );
            someData = newSuspect;
          }
        }
        res.send(someData);
      }
    });
  });

  //Report a suspect
  app.post('/api/suspects/:steamId/comments', async (req, res) => {
    let data = null;
    const existingUser = await User.findOne({
      steamId: req.body.owner
    });
    const theSuspect = await Suspect.findOne({
      steamId: req.params.steamId
    });

    if (existingUser && theSuspect) {
      //TODO: user cannot comment on his own profile (yet)
      if (checkData(req.body)) {
        const newComment = await new Comment({
          owner: existingUser._id,
          text: req.body.text,
          evidence: req.body.evidence,
          votes: 0,
          type: req.body.type,
          date: Date.now()
        }).save();
        data = newComment;
        theSuspect.comments.push(newComment._id);
        if (req.body.type === true) {
          theSuspect.griefReports += 1;
        } else {
          theSuspect.toxicReports += 1;
        }

        await theSuspect.save();
      }
    }
    res.send(data);
  });

  app.get('/api/suspects/:steamId/steam', (req, res) => {
    let someData = false;
    steamAPI.getPlayerSummaries({
      steamids: [req.params.steamId],
      callback: async (err, data) => {
        if (data.response.players.length != 0) {
          someData = data.response.players[0];
        }
        res.send(someData);
      }
    });
  });

  function checkData(bodyData) {
    if (bodyData.text && bodyData.evidence && bodyData.type) {
      return true;
    }
    return false;
  }
};
