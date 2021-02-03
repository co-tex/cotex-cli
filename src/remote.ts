import * as ConfigStore from 'configstore';
import * as CLI from 'clui';
import jwtDecode, { JwtPayload } from "jwt-decode";
import * as inquirer from 'inquirer';
import axios from 'axios';
import { findRoot, isProject } from './util';
import { exit } from 'process';
import { red, grey, green } from 'chalk';


function remote() {
    const currentPath = process.cwd();
    
    if(!isProject(currentPath)) {
        console.log(red('Not a CoTex project!'));
        console.log(`To initialize run: ${grey('cotex init')}`);
        exit();
    }
    
    const rootPath = findRoot(currentPath);
    const cs = new ConfigStore('cotex-cli',{},{ configPath: rootPath + '/.cotex/config.json' } );
    
    return axios.get(cs.get('url') + '/projects', {
        headers: {
            Authorization: "Bearer " + cs.get('access_token')
        }
    })
    .then((res) => {
        console.log(res.data);
    }).catch((err) => {
        console.log(err.response.status);
    })

}
export { remote as cli }