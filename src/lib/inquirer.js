const inquirer = require('inquirer');
const path = require('path');

var currentPath = process.cwd();

module.exports = {
  askProjectDetails: () => {
    const questions = [
      {
        name: 'isRoot',
        type: 'confirm',
        message: 'Is \'' + currentPath + '\' your project root?',
        validate: function( isRoot ) {
          console.log(value);
          if (value) {
            return true;
          } else {
            return 'Please enter your username or e-mail address.';
          }
        }
      },
      {
        name: 'root',
        type: 'input',
        default: '/',
        when: function(answers) {
          if(answers.isRoot)
            return false;
          else
            return true;
        },
        message: 'Enter the project path (relative to the current directory):',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your path.';
          }
        }
      }
    ];
    return inquirer.prompt(questions).then(answers => {
      //
    });
  },
};
