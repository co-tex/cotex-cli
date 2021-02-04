import { cotex }  from './cotex';
import fs = require('fs');
import chokidar = require('chokidar');
import { getConfig } from './util';
import { green } from 'chalk';

async function start() {
  const config = getConfig();
  const output = config.get('main').replace('.tex','.pdf');

  console.log('Starting CoTex remote compilation...');
  console.log(green('Live preview: ') + config.get('url') + '/projects/' + 
    config.get('projectId') + '/preview?file=' + output);
  
  await cotex.commands.compile();
  
  return chokidar
  .watch(config.get('root'), {
    ignored: new RegExp("(^|[\\/\\\\])\\..|node_modules|" + output),
    persistent: true,
    ignoreInitial: true,
  })
  .on('all', async (event: any, path: any) => {
    await cotex.commands.compile();
  });
}
export { start as cli };
