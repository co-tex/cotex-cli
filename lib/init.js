'use strict';
const fs = require('fs');

function init(args) {
  return new Promise((resolve,reject) => {
    if(!fs.existsSync('.cotex'))
      fs.mkdir('.cotex', (err) => {
        return reject(err);
      });
    else
      console.log('Already initialized! Consider setting configur instead.')
  });
}
exports.cli = init;
exports.api = init;