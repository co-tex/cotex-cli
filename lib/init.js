'use strict';

const chalk = require('chalk');
const figlet = require('figlet');

function init(args) {
  return new Promise((resolve,reject) => {
    if(args) {
      const err = new Error('Usage: cotex init');
      err.type = 'EUSAGE';
      return reject(err);
    }

    console.log(
      chalk.red(
        figlet.textSync('CoTex CLI', { horizontalLayout: 'full' }))
      + '\n' +
      '                              ' + 
      chalk.green('Tex/Latex with anyone, anywhere!\n') +
      '                      ' + 
      chalk.green('Author: Sushovan Majhi <sush@smajhi.com>\n\n')
    );
  });
}
exports.cli = init;
exports.api = init;