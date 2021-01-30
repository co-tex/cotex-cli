import * as fs from 'fs';

const cotex: any = {
  loaded: false,
  cli: {},
  commands: {},
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
            this.commands[cmd] = mod.api;
          }
        });
        this.loaded = true;        
        resolve();
      });
    });
  },
  //});
};
export { cotex }