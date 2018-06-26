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
              steamId: req.body.steamId
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

  //Comment on a suspect's profile
  app.post('/api/suspects/:steamId/comments', async (req, res) => {
    let data = false;
    const existingUser = await User.findOne({
      steamId: req.body.owner
    });
    const theSuspect = await Suspect.findOne({
      steamId: req.params.steamId
    });

    if (existingUser && theSuspect && checkData(req.body)) {
      //TODO: user cannot comment on his own profile (yet)
      const newComment = await new Comment({
        owner: existingUser._id,
        text: req.body.text,
        votes: 0,
        date: Date.now()
      }).save();
      data = newComment;
      theSuspect.comments.push(newComment._id);
      await theSuspect.save();
    }
    res.send(data);
  });

  //Get Steam info
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

  //Report a suspect
  app.post('/api/suspects/:steamId/follow', async (req, res) => {
    let response = false;
    const theSuspect = await Suspect.findOne({
      steamId: req.params.steamId
    });
    const existingUser = await User.findOne({
      steamId: req.body.owner
    });

    if (theSuspect && existingUser) {
      const suspectReports = theSuspect.votes;
      if (!(suspectReports.indexOf(existingUser.steamId) > -1)) {
        theSuspect.votes.push(existingUser.steamId);
        existingUser.following.push(theSuspect._id);
        response = true;
        await theSuspect.save();
        await existingUser.save();
      }
    }
    res.send(response);
  });

  //Unfollow a suspect
  app.post('/api/suspects/:steamId/unfollow', async (req, res) => {
    let response = false;
    const theSuspect = await Suspect.findOne({
      steamId: req.params.steamId
    });
    const existingUser = await User.findOne({
      steamId: req.body.owner
    });

    if (theSuspect && existingUser) {
      const suspectReports = theSuspect.votes;
      const index = suspectReports.indexOf(existingUser.steamId);
      if (index > -1) {
        theSuspect.votes.splice(index, 1);
        const index2 = existingUser.following.indexOf(theSuspect._id);
        if (index2 > -1) {
          existingUser.following.splice(index2, 1);
          response = true;
          await theSuspect.save();
          await existingUser.save();
        }
      }
    }
    res.send(response);
  });

  function checkData(bodyData) {
    if (bodyData.text) {
      return true;
    }
    return false;
  }
};
