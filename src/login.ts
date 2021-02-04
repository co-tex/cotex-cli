import * as CLI from 'clui';
import * as inquirer from 'inquirer';
import axios from 'axios';
import { exit } from 'process';
import { red, grey, green } from 'chalk';
import { getConfig } from './util';

async function login(): Promise<void> {
    const config = getConfig();    
      
    const token = config.get('access_token');
    const url = config.get('url');
    const status = new CLI.Spinner('Authenticating you. Please wait...');
    
    if(!url) {
        console.log(red('Project not properly initialized!'));
        console.log('Run: ' + grey('cotex init'));
        exit();
    }
    
    return inquirer.prompt([
        {
            name: 'email',
            type: 'input',
            message: 'Email address for (' +  grey(url) + '):',
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
            mask: true,
            message: 'Enter your password:',
            validate: function(value: string) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your password.';
                }
            },
        }
    ])
    .then((answers) => {
        status.start();
        return axios.post(url + '/auth/login', answers);
    }) 
    .then((response) => {
        config.set('access_token', response.data.access_token);
        config.set('userId', response.data.userId);
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