import * as inquirer from 'inquirer';
import axios from 'axios';
import { getConfig, authHeader } from './util';
import {  green, grey } from 'chalk';


function remote() {
    const config = getConfig();

    return axios.get(config.get('url') + '/users/' + config.get('userId') + '/projects',{
        headers: authHeader()
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
                        const res = await axios.post(config.get('url') + '/projects', {name: value},{
                            headers: {
                                Authorization: "Bearer " + config.get('access_token')
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
            config.set('projectId', answers.projectId || newId); 
            console.log('Remote is now set. Run: ' + grey('cotex start'));
        });
    });
}
export { remote as cli }