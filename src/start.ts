import { cotex }  from './cotex';
import fs = require('fs');
import chokidar = require('chokidar');

async function start() {
  console.log('Starting CoTex remote compilation...');
  console.log('Live preview: http://localhost:5000/projects/1/preview');
  
  await cotex.commands.compile();
  
  chokidar
  .watch('/home/sushovan/shape-reconstruction', {
    ignored: /(^|[\/\\])\..|node_modules|reconstruction.pdf/,
    persistent: true,
    ignoreInitial: true,
  })
  .on('all', async (event: any, path: any) => {
    await cotex.commands.compile();
  });
}
export { start as cli };
