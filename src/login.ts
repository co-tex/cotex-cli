import * as ConfigStore from 'configstore';
import * as CLI from 'clui';

const conf = new ConfigStore('@cotex/cli');
const Spinner = CLI.Spinner;
const status = new Spinner('Authenticating you, please wait...');


function login() {
    status.start();
}
export { login as cli };