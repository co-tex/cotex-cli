'use strict';

const chalk = require('chalk');
const figlet = require('figlet');

console.log(
    chalk.red(
      figlet.textSync('CoTex CLI', { horizontalLayout: 'full' }))
    + '\n' +
    '                              ' + 
    chalk.green('Tex/Latex with anyone, anywhere!\n') +
    '                      ' + 
    chalk.green('Author: Sushovan Majhi <sush@smajhi.com>\n\n')
);
