// nodejs only lib
jscript = 0; //0: node, else: JScript
// import * as alib from "../shared/alib.js" // Shared lib between NodeJS and JScript
fs = require('fs');

del = function(fn) {
  try {
    fs.unlink(fn, function(error) {
      if (error) {
        throw error;
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

var alib = require('../shared/alib');

console.log(alib.default);
