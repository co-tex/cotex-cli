import * as fs from 'fs';

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

export { isProject, findRoot };