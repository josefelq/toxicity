const mongoose = require('mongoose');
const steam = require('steam-web');
const keys = require('../config/keys');

const getSteamID64 = require('../services/steamSearch');
const getSteamUser = require('../services/steamUser');
const steamAPI = new steam({
  apiKey: keys.steamWebAPIKey,
  format: 'json' //optional ['json', 'xml', 'vdf']
});

const User = mongoose.model('users');
const Suspect = mongoose.model('Suspect');
const Comment = mongoose.model('Comment');

module.exports = app => {
  //Returns steamID given URL
  app.post('/api/suspects/search', async (req, res) => {
    let response = false;

    const steamSearch = req.body.uri.replace(/\s+/g, '');
    if (steamSearch) {
      if (steamSearch.includes('https://steamcommunity.com')) {
        if (steamSearch.includes('https://steamcommunity.com/id/')) {
          const search = steamSearch + '/?xml=1';
          const customId = await getSteamID64(search);
          if (customId) {
            response = { theId: customId.steamID64 };
          }
        } else {
          const userId = steamSearch.replace(
            'https://steamcommunity.com/profiles/',
            ''
          );
          let i = 0;
          for (; i < userId.length; i++) {
            if (userId.charAt(i) === '/') {
              break;
            }
          }
          const finalUserId = userId.substring(0, i + 1);
          response = { theId: finalUserId };
        }
      } else {
        response = { theId: steamSearch };
      }
    }
    res.send(response);
  });

  //Get Suspect info
  app.get('/api/suspects/:steamId', async (req, res) => {
    let data = false;
    const theSuspect = await Suspect.findOne({
      steamId: req.params.steamId
    })
      .populate('comments')
      .lean();
    if (theSuspect) {
      if (theSuspect.comments.length > 0) {
        const theArray = theSuspect.comments;
        for (let i = 0; i < theArray.length; i++) {
          let element = theArray[i];
          const userInfo = await User.findById(element.owner);
          element.steamName = userInfo.steamName;
          element.steamAvatar = userInfo.steamAvatar;
          element.steamId = userInfo.steamId;
        }
      }
      data = theSuspect;
    }
    res.send(data);
  });

  //Create a suspect
  app.post('/api/suspects', async (req, res, next) => {
    let someData = false;
    //check if steamID is number
    const isNum = /^\d+$/.test(req.body.steamId);
    //check if it's a valid steam user
    steamAPI.getPlayerSummaries({
      steamids: [req.body.steamId],
      callback: async (err, data) => {
        if (!err) {
          if (data.response.players.length === 1 && isNum) {
            const checkSuspect = await Suspect.findOne({
              steamId: req.body.steamId
            });
            if (!checkSuspect) {
              const newSuspect = await new Suspect({
                steamId: req.body.steamId,
                steamName: data.response.players[0].personaname,
                steamAvatar: data.response.players[0].avatarfull
              }).save();

              const updateUser = await User.findOneAndUpdate(
                { steamId: req.body.steamId },
                { suspect: newSuspect._id }
              );
              someData = newSuspect;
            }
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

    if (existingUser && theSuspect && checkData(req.body.text)) {
      const existingComment = await Comment.findOne({
        owner: existingUser._id
      });
      let index = -1;
      if (existingComment) {
        index = theSuspect.comments.indexOf(existingComment._id);
      }
      if (!(index > -1)) {
        const newComment = await new Comment({
          owner: existingUser._id,
          text: req.body.text,
          date: Date.now(),
          suspect: theSuspect._id
        }).save();
        data = newComment;
        theSuspect.comments.push(newComment._id);
        await theSuspect.save();
      }
    }
    res.send(data);
  });

  //Delete a comment from suspect profile
  app.delete('/api/suspects/:steamId/comments', async (req, res) => {
    let response = false;
    const theSuspect = await Suspect.findOne({
      steamId: req.params.steamId
    });
    const existingUser = await User.findOne({
      steamId: req.body.owner
    });

    if (existingUser && theSuspect) {
      const deletedComment = await Comment.findOne({
        owner: existingUser._id,
        suspect: theSuspect._id
      });
      if (deletedComment) {
        const index = theSuspect.comments.indexOf(deletedComment._id);
        if (index > -1) {
          theSuspect.comments.splice(index, 1);
          await theSuspect.save();
        }
        await deletedComment.remove();
        response = true;
      }
    }
    res.send(response);
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

  //get User data
  app.get('/api/users/:userId', async (req, res) => {
    let response = false;
    const existingUser = await User.findById(req.params.userId).populate(
      'following'
    );

    if (existingUser) {
      response = existingUser;
    }
    res.send(response);
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

  //Like a comment
  app.post('/api/comments/:commentId', async (req, res) => {
    let data = false;
    const existingComment = await Comment.findById(req.params.commentId);
    const existingUser = await User.findOne({ steamId: req.body.owner });
    if (existingComment && existingUser) {
      if (!(existingComment.participants.indexOf(existingUser.steamId) > -1)) {
        existingComment.participants.push(existingUser.steamId);
        await existingComment.save();
        data = true;
      }
    }

    res.send(data);
  });

  //Unlike a comment
  app.delete('/api/comments/:commentId', async (req, res) => {
    let data = false;
    const existingComment = await Comment.findById(req.params.commentId);
    const existingUser = await User.findOne({ steamId: req.body.owner });
    if (existingUser && existingComment) {
      let index = existingComment.participants.indexOf(existingUser.steamId);
      if (index > -1) {
        existingComment.participants.splice(index, 1);
        await existingComment.save();
        data = true;
      }
    }
    res.send(data);
  });

  //Update
  app.post('/api/users/:id/update', async (req, res) => {
    let response = false;
    const existingUser = await User.findById(req.params.id);
    if (existingUser) {
      const request = await getSteamUser(existingUser.steamId);
      if (request.length === 1) {
        if (existingUser.steamName !== request.personaname) {
          existingUser.steamName = request[0].personaname;
        }
        if (existingUser.steamAvatar !== request.avatarfull) {
          existingUser.steamAvatar = request[0].avatarfull;
        }
        await existingUser.save();
        response = existingUser;
      }
    }
    res.send(response);
  });

  function checkData(bodyData) {
    if (bodyData) {
      return true;
    }
    return false;
  }
};
