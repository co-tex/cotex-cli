const cc = require('config-chain');
import { cotex } from './cotex';

export class config {
  static loadConfig(nopts: { cotexconf: any }) {
    return new Promise((resolve, reject) => {
      let cfg: {};

      if (!nopts.cotexconf) {
        cfg = cc(nopts)
          .on('load', () => {
            cotex.config = cfg;
            resolve(cfg);
          })
          .on('error', reject);
      } else {
        cfg = cc(nopts)
          .addFile(nopts.cotexconf, 'ini', 'config')
          .on('load', () => {
            cotex.config = cfg;
            resolve(cfg);
          })
          .on('error', reject);
      }
    });
  }
}
