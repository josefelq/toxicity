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
      res.send(data);
    }
  });

  function runPlease() {
    console.log('llegamos aqui');
  }

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
    //TODO: user cannot comment on his own profile (yet)
    if (existingUser && theSuspect && checkData(req.body.text)) {
      const existingComment = await Comment.findOne({
        owner: existingUser._id
      });
      let index = -1;
      /*
      if (existingComment) {
        index = theSuspect.comments.indexOf(existingComment._id);
      }
      */
      if (!(index > -1)) {
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
        owner: existingUser._id
      });
      if (deletedComment) {
        const index = theSuspect.comments.indexOf(deletedComment._id);
        if (index > -1) {
          theSuspect.comments.splice(index, 1);
          await theSuspect.save();
        }
        await deletedComment.remove();
        response = deletedComment;
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
    const existingUser = await User.findById(req.params.userId);

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

  function checkData(bodyData) {
    if (bodyData) {
      return true;
    }
    return false;
  }
};
