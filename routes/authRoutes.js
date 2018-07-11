const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get(
    '/auth/steam/return',
    // Issue #37 - Workaround for Express router module stripping the full url, causing assertion to fail
    /*
    (req, res, next) => {
      req.url = req.originalUrl;
      next();
    },
    */
    passport.authenticate('steam', { failureRedirect: '/error' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
