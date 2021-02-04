import * as fs from 'fs';
import * as fg from 'fast-glob';
import { grey, red } from 'chalk';
import { exit } from 'process';
import * as Configstore from 'configstore';

function findRoot(path: string): string {

    while(path !== '') {
        if(fs.existsSync(path + '/.cotex')) {
            return path;
        }
        
        if(path === '/') 
        break;

        const idx = path.lastIndexOf('/');
        if(idx !== 0)
            path = path.slice(0,idx);
        else
            path = '/';
    }
    return '';
}

function isProject(path: string): boolean {
    return findRoot(path).length> 0;  
}

function index(dir: string): Promise<any> {
    return fg(['**/**'], {
        cwd: dir,
        stats: true,
        ignore: ['/.cotex|.git|node_modules/']
    }).then((files) => {
        const index: any = {};
        files.forEach(file => {
            index[file.path] = {
                name: file.name,
                mtime: file.stats?.mtime
            } 
        });
        return index;
    });
}

function changeSet(df: any) {
    const set: any = {
        added: [],
        modified: [],
        deleted: []
    };

    for(let item in df) {
        if(item.split('__').pop() === 'added') {
            set.added.push({ 
                path: item.slice(0,item.lastIndexOf('__added')), 
                dir: item.substr(0,item.lastIndexOf('/' + df[item].name + '__added')), 
                name: df[item].name
             });
        }
        else if(item.split('__').pop() === 'deleted') {
            set.deleted.push({ 
                path: item.slice(0,item.lastIndexOf('__deleted')), 
                dir: item.substr(0,item.lastIndexOf('/' + df[item].name + '__deleted')), 
                name: df[item].name
             });
        }
        else if(Date.parse(df[item].mtime.__old) < Date.parse(df[item].mtime.__new)) {
            set.modified.push({ 
                path: item, 
                dir: item.substr(0,item.lastIndexOf('/' + item.split('/').pop())),
                name: item.split('/').pop() 
            });
        }
    }
    return set;
}
function getConfig() {
    const currentPath = process.cwd();
    
    if(!isProject(currentPath)) {
        console.log(red('Not a CoTex project!'));
        console.log(`To initialize run: ${grey('cotex init')}`);
        exit();
    }
    
    const rootPath = findRoot(currentPath);
    return new Configstore('cotex-cli',{},{ configPath: rootPath + '/.cotex/config.json' } );
}
function authHeader() {
    const config = getConfig();
    if(!config.get('access_token')) {
        console.log(red('You are not logged in!'));
        console.log('To log in run: ' + grey('cotex login'));
        exit()
    }
    return {
        Authorization: "Bearer " + config.get('access_token')
    }
}
export { isProject, findRoot, index, changeSet, getConfig, authHeader };