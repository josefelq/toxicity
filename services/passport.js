const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const getSteamUser = require('./steamUser');

const User = mongoose.model('users');
const Suspect = mongoose.model('Suspect');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new SteamStrategy(
    {
      returnURL: keys.returnURL,
      realm: keys.realm,
      apiKey: keys.steamWebAPIKey
      //proxy: true
    },
    async (identifier, profile, done) => {
      const existingUser = await User.findOne({ steamId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const steamCall = await getSteamUser(profile.id);
      const steamData = steamCall[0];

      const existingSuspect = await Suspect.findOne({ steamId: profile.id });

      let user = null;

      if (existingSuspect) {
        user = await new User({
          steamId: profile.id,
          steamAvatar: steamData.avatarfull,
          steamName: steamData.personaname,
          suspect: existingSuspect._id
        }).save();
      } else {
        user = await new User({
          steamId: profile.id,
          steamAvatar: steamData.avatarfull,
          steamName: steamData.personaname
        }).save();
      }
      done(null, user);
    }
  )
);
