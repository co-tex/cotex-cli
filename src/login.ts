import * as ConfigStore from 'configstore';
import * as CLI from 'clui';
import jwtDecode, { JwtPayload } from "jwt-decode";
import * as inquirer from 'inquirer';
import axios from 'axios';
import { findRoot, isProject } from './util';
import { exit } from 'process';
import { red, grey, green } from 'chalk';

const questions = [
    {
        name: 'email',
        type: 'input',
        message: 'Enter your CoTex e-mail address:',
        validate: function(value: string) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your e-mail address.';
            }
        }
    },
    {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function(value: string) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your password.';
            }
        },
    }
]

async function login(): Promise<void> {
    const currentPath = process.cwd();
    
    if(!isProject(currentPath)) {
        console.log(red('Not a CoTex project!\n'));
        console.log(`Run ${grey('cotex init')} first`);
        exit();
    }
    
    const rootPath = findRoot(currentPath);
    const cs = new ConfigStore('cotex-cli',{},{ configPath: rootPath + '/.cotex/config.json' } );

    const token = cs.get('access_token');
    /* if(token) {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Already logged in!');
        exit();
    } */
    
    const url = cs.get('url');
    const status = new CLI.Spinner('Authenticating you. Please wait...');
    if(!url) {
        console.log(red('Project not properly initialized!'));
        console.log('Run: ' + grey('cotex init'));
        exit();
    }

    return inquirer.prompt(questions)
    .then((answers) => {
        status.start();
        return axios.post(url + '/auth/login', answers);
    }) 
    .then((response) => {
        cs.set('access_token', response.data.access_token);
        console.log(green('You are now logged in!'));
        console.log('Run: ' + grey('cotex start'));   
    })
    .catch((error) => {
        if(error.response.status === 401) {
            console.log(red('Oops!') + ' The combination did not work!');
        }
    })
    .finally(() => {
        status.stop();
    }); 
}
export { login as cli };