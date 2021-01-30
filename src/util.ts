import * as fs from 'fs';
import * as fg from 'fast-glob';

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
export { isProject, findRoot, index, changeSet };