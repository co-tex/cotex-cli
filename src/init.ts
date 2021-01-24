import * as fs from 'fs';
import * as inquirer from 'inquirer';
import { exit } from 'process';
import { green, grey } from 'chalk';

const currentPath = process.cwd();

const questions: any = [
  {
    name: 'isRoot',
    type: 'confirm',
    message: "Is '" + green(currentPath) + "' your project root?",
    validate: function(input: string) {
      if(input.length) {
        return true;
      } else {
        return 'Please enter Y or n';
      }
    },
  },
  {
    name: 'root',
    type: 'input',
    default: currentPath,
    when: function(answers: any) {
      if (answers.isRoot) return false;
      else return true;
    },
    message: 'Enter the root of the project:',
    validate: function (value: string) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter your path.';
      }
    },
  },
  {
    name: 'mainFile',
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
    name: 'remote',
    type: 'input',
    message: 'Enter the the URL of the remote server:',
    default: 'https://compile.cotex.org',
    validate: function (value: string) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter the URL.';
      }
    },
  },
];

function init(args?: any): Promise<void> {
  if (!fs.existsSync('.cotex')) {
    fs.mkdirSync('.cotex');
  }
  else {
    console.log('Already a Cotex project.')
    exit();
  }
 
  return inquirer.prompt(questions).then((ans) => {
    console.log('You are all set!\n');
    console.log(`To login to the remote server use the command: ${grey('cotex login')}\n`);
  });
}
export { init as cli };

