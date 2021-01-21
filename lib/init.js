'use strict';


function init(args) {
  return new Promise((resolve,reject) => {
    if(args) {
      const err = new Error('Usage: cotex init');
      err.type = 'EUSAGE';
      return reject(err);
    }
  });
}
exports.cli = init;
exports.api = init;