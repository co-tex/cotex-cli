import * as ConfigStore from 'configstore';
import * as CLI from 'clui';
import jwtDecode, { JwtPayload } from "jwt-decode";
import * as inquirer from 'inquirer';
import { exit } from 'process';
import axios from 'axios';

const conf = new ConfigStore('@cotex/cli');

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

function login(): Promise<void> {
    const token = conf.get('access_token');
    if(token) {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Already logged in!');
        exit();
    }
    
    return inquirer.prompt(questions)
        .then(async (answers: any) => {
            const status = new CLI.Spinner('Authenticating you. Please wait...');
            status.start();

            const response: any = await axios.post('http://localhost:3000/auth/login',answers);
            status.stop();
            console.log(response);
            conf.set('access_token', response.data.access_token);
        });
}
export { login as cli };