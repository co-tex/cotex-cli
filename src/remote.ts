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
    
    return axios.get(cs.get('url') + '/users/' + cs.get('userId') + '/projects',{
        headers: {
            Authorization: "Bearer " + cs.get('access_token')
        }
    }).catch((err) => {
        console.log(err);
    })
    .then((res: any) => {
        const choices =  res.data.map((element: any) => {
            element.value = element.id;
            return element;
        });
        choices.push({
            name: green('create new'),
            value: null
        });
        
        let newId: string;

        inquirer.prompt([
                {
                    name: 'projectId',
                    message: 'Select a remote project or create new:',
                    type: 'list',
                    choices: choices
                },
                {
                    name: 'newProjectId',
                    message: 'Enter the name of the new project',
                    when: (answers) => {
                        if(answers.projectId)
                            return false;
                        else
                            return true;
                },
                validate: async (value) => {
                    if(value.length) {
                        const res = await axios.post(cs.get('url') + '/projects', {name: value},{
                            headers: {
                                Authorization: "Bearer " + cs.get('access_token')
                            }
                        });
                        newId = res.data.id;
                        return true;
                    }
                    else
                    return false;
                }
            }
        ])
        .then((answers) => { 
            cs.set('projectId', answers.projectId || newId); 
            });
    });
}
export { remote as cli }