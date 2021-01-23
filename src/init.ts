import * as fs from 'fs';

function init(args: any) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('.cotex'))
      fs.mkdir('.cotex', (err) => {
        return reject(err);
      });
    else console.log('Already initialized! Consider setting configur instead.');
  });
}
export { init as cli };
export { init as api };
