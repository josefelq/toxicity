const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

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
      const user = await new User({ steamId: profile.id }).save();
      done(null, user);
    }
  )
);
