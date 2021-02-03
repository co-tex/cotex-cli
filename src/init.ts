import { red, green, grey, yellow, gray } from 'chalk';
import { textSync } from 'figlet';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import { exit } from 'process';
import * as ConfigStore from 'configstore';
import { findRoot, isProject } from './util';

const currentPath = process.cwd();

const questions: any = [
  {
    name: 'url',
    type: 'input',
    message: 'Enter the the URL of the remote server:',
    default: 'https://compile.cotex.org',
    validate: function (value: string) {
      const regexp = new RegExp(/^https?:\/\/\w+(\.\w+)*(:[0-9]+)?(\/.*)?$/);    
      if (regexp.test(value)) {
        return true;
      } else {
        return 'Please enter a valid URL with http:// or https:// prefix.';
      }
    },
  },
  {
    name: 'main',
    type: 'input',
    message: 'Enter the name of the main tex file (relative to the root of the project):',
    default: 'main.tex',
    validate: function (value: string) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter the file name.';
      }
    },
  },
  {
      name: 'autoCompile',
      type: 'confirm',
      message: 'Enable auto compile on save?',
  }
];

async function init(args?: any) { 
  console.log(
      red(textSync('CoTex CLI', { horizontalLayout: 'full' })) +
        '\n'+ green('Tex/Latex with anyone, anywhere!\n') +
        green('Author: Sushovan Majhi <sush@smajhi.com>\n'),
  );

  if(isProject(currentPath) && findRoot(currentPath) !== currentPath) {
    console.log(red('Already a CoTex project!\n'));
    console.log(`Go to the root directory and run: ${grey('cotex init')}`);
    exit();
  }

  const answers = await inquirer.prompt([
    {
      name: 'isRoot',
      type: 'confirm',
      message: "Is (" + gray(currentPath) + ") your project root?",
    },    
  ]);
  if(!answers.isRoot) {
    console.log(`${red('Usage')}: Please go to the root of your project and use: ${grey('cotex init')}`);
    exit();
  };

  inquirer.prompt(questions).then((answers) => {
    if(!fs.existsSync(currentPath + '/.cotex'))
      fs.mkdirSync(currentPath + '/.cotex');

    const cs = new ConfigStore('cotex-cli', null,{ configPath: currentPath + '/.cotex/config.json' });
    cs.set(answers);
  }).finally(() => {
    console.log(`\nYou are all set!\nPlease login: ${grey('cotex login')}`);
  });
}
export { init as cli };