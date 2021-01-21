'use strict';

const fs = require('fs');
const pkg = require('../package.json');
const config = require('./config.js');

const cotex = { loaded: false };
cotex.version = pkg.version;
const api = {}, cli = {};

Object.defineProperty(cotex, 'commands', {
    get: () => {
      if (cotex.loaded === false) {
        throw new Error('run cotex.load before');
      }
      return api;
    }
});
  
Object.defineProperty(cotex, 'cli', {
    get: () => {
      if (cotex.loaded === false) {
        throw new Error('run cotex.load before');
      }
      return cli;
    }
});

cotex.load = function load(opts) {
    return new Promise((resolve, reject) => {

        config.loadConfig(opts)
        .then((cfg) => {

            cotex.config = cfg;

            fs.readdir(__dirname, (err, files) => {
                files.forEach((file) => {
                    if (!/\.js$/.test(file) || file === 'cotex.js') {
                        return;
                    }
    
                    const cmd = file.match(/(.*)\.js$/)[1];
                    const mod = require('./' + file);
                
                    if (mod.cli) {
                        cli[cmd] = mod.cli;
                    }
                    if (mod.api) {
                        api[cmd] = mod.api;
                    }
                });
        
                cotex.loaded = true;
                resolve(cotex);
            });    
        });
    });
};
module.exports = cotex;