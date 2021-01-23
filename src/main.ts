import * as nopt from 'nopt';
import * as log from 'npmlog';
import { cotex } from './cotex';
import * as help from './help';

import { green } from 'chalk';
import * as osenv from 'osenv';
import * as fs from 'fs';
//import pkg = require('../package.json');

const parsed = nopt({
    'json': [Boolean]
}, {'j': '--json'}, process.argv, 2);

/* const home = osenv.home();
parsed.cotexconf = home + '/' + '.cotexrc';
 */
/* if (!fs.existsSync(parsed.cotexconf)) {
    console.log(green('CREATE' + ' config file'));
    fs.writeFileSync(parsed.cotexconf, '');
}
*/

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
        //log.error('', 'cotex:', pkg.version, 'node:', process.version);
        //log.error('', 'please open an issue including this log on ' + pkg.bugs.url);
    }
    process.exit(1);
}