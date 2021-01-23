'use strict';

const cc = require('config-chain');
const cotex = require('./cotex.js')

exports.loadConfig = loadConfig;
function loadConfig(nopts) {
  return new Promise((resolve, reject) => {
    let cfg;

    if(!nopts.cotexconf) {
      cfg = cc(nopts)
        .on('load', () => {
          cotex.config = cfg;
          resolve(cfg);
        }).on('error', reject);
    } else {
      cfg = cc(nopts)
        .addFile(nopts.cotexconf, 'ini', 'config')
        .on('load', () => {
          cotex.config = cfg;
          resolve(cfg);
        }).on('error', reject);
    }
  });
};
