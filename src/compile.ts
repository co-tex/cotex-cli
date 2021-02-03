import { cotex }  from './cotex';
import { default as axios } from 'axios';
import fs = require('fs');

const url = 'http://localhost:5000';
const output = 'reconstruction.pdf'

async function compile() {
    return cotex.commands.sync()
        .then(() => {
            return axios({
              url: url + '/projects/1/compile',
              method: 'post',
              data: {
               output: output
              }
            })
        });
}
export { compile as cli, compile as api };
