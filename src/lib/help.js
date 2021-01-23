'use strict';

const cotex = require('./cotex.js');
const isWindows = require('os').platform() === 'win32';
const spawnSync = require('child_process').spawnSync;
const opener = require('opener');
const path = require('path');

exports.cli = help;
function help (command) {
  return new Promise((resolve, reject) => {

    if (!cotex.cli[command]) {
      console.log(getGeneralHelpMessage());
    } else {
      openDocumentation(command);
    }

    resolve();
  });
}

function getGeneralHelpMessage() {
    const commands = Object.keys(cotex.cli).join(', ');

    const message = `Usage: cotex <command>
    
    The available commands for cotex are:
    
    ${commands}
    
    You can get more help on each command with: cotex help <command>
    
    Example:
    cotex help init
    
    cotex v${cotex.version} on Node.js ${process.version}`;
    
    return message;
}

function openDocumentation (command) {

    if (isWindows) {
      const htmlFile = path.resolve(__dirname + '/../website/cli-' + command + '.html');
      return opener('file:///' + htmlFile);
   }
  
    spawnSync('man', ['cotex-' + command], {stdio: 'inherit'});
}