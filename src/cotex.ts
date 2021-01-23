import * as fs from 'fs';
//import * as pkg from '../package.json';
//import { config } from './config';

export const cotex: any = {
  loaded: false,
  cli: {},
  api: {},
  load: function (opts: any): Promise<void> {
    return new Promise((resolve, reject) => {
      //config.loadConfig(opts).then((cfg) => {
      //  cotex.config = cfg;
      fs.readdir(__dirname, (err, files) => {
        files.forEach((file) => {
          if (!/\.js$/.test(file) || file === ( 'cotex.js' || 'main.js' ) ) {
            return;
          }
    
          let cmd = file.match(/(.*)\.js$/)![1];
          let mod = require('./' + file);
          
          if (mod.cli) {
            this.cli[cmd] = mod.cli;
          }
          if (mod.api) {
            this.api[cmd] = mod.api;
          }
        });
        this.loaded = true;        
        resolve();
      });
    });
  },
  //});
};

/* Object.defineProperty(cotex, 'commands', {
  get: () => {
    if (cotex.loaded === false) {
      throw new Error('run cotex.load before');
    }
    return api;
  },
});

Object.defineProperty(cotex, 'cli', {
  get: () => {
    if (cotex.loaded === false) {
      throw new Error('run cotex.load before');
    }
    return cli;
  },
});
*/