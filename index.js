
const files = require('./lib/files');

const inquirer = require('./lib/inquirer');

// Inquire user about Git
const run = async () => {
  const credentials = await inquirer.askProjectDetails();
  console.log(credentials);
};

run();