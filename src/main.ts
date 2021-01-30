import * as nopt from 'nopt';
import * as log from 'npmlog';
import { cotex } from './cotex';
import * as help from './help';
import * as osenv from 'osenv';
import * as fs from 'fs';

const parsed = nopt({
    'json': [Boolean]
}, {'j': '--json'}, process.argv, 2);

const home = osenv.home();
parsed.cotexconf = home + '/' + '.cotexrc';
if (!fs.existsSync(parsed.cotexconf)) {
    fs.writeFileSync(parsed.cotexconf, '');
}

const cmd: string = parsed.argv.remain.shift() || "";
cotex.load(parsed).then(() => {
   
    if (!cotex.cli[cmd]) {
        return help.cli('');
    }
    
    cotex.cli[cmd]
    .apply(null, parsed.argv.remain)
    .catch(errorHandler);
}).catch(errorHandler);

function errorHandler(err: Error) {
    if (!err) {
        process.exit(1);
    }
 
    if (err.name === 'EUSAGE') {
        err.message && log.error(err.name,err.message);
        process.exit(1);
    }
    
    err.message && log.error("",err.message);

    if (err.stack) {
        log.error('', err.stack);
        log.error('', '');
        log.error('', '');
    }
    process.exit(1);
}