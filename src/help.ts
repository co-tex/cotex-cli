import {cotex } from './cotex';
import * as path from 'path';
import { green, red } from 'chalk';

const isWindows = require('os').platform() === 'win32';
const spawnSync = require('child_process').spawnSync;
const opener = require('opener');

export function help(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!cotex.cli[command]) {
      console.log(getGeneralHelpMessage());
    } else {
      openDocumentation(command);
    }

    resolve();
  });
}
export { help as cli };

function getGeneralHelpMessage() {
  const commands = Object.keys(cotex.cli).join(', ');

  const message = `${red('usage')}: cotex <${green('command')}> [args]
    
    The available commands for cotex are:
    
    ${commands}
    
    You can get more help on each command with: cotex help <command>
    
    Example:
    cotex help init
    
  `;

  return message;
}

function openDocumentation(command: string) {
  if (isWindows) {
    const htmlFile = path.resolve(__dirname + '/../website/cli-' + command + '.html');
    return opener('file:///' + htmlFile);
  }

  spawnSync('man', ['cotex-' + command], { stdio: 'inherit' });
}
