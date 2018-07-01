/*
DISCLAIMER: THE OWNER OF THE FOLLOWING CODE IS: Yamil Llanos. NOT ME.
THIS IS JUST A SLIGHT MODIFICATION OF THE RETURN VALUE
I HAVE ADDED THE NPM PACKAGE FOR CLARIFICATION.
YOU CAN FIND THE SOURCE CODE HERE (MIT LICENCE): https://github.com/yllanos/customurl2steamid64
*/
var rp = require('request-promise');
var parseString = require('xml2js').parseString;

module.exports = function getSteamID64(URL) {
  return rp(URL).then(function(xml) {
    return new Promise(function(resolve, reject) {
      parseString(
        xml,
        {
          explicitArray: false,
          ignoreAttrs: true,
          trim: true
        },
        function(err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result['profile']);
          }
        }
      );
    });
  });
};
