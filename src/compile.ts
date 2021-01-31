import { cotex }  from './cotex';
import { default as axios } from 'axios';
import fs = require('fs');

const url = 'http://localhost:3000';
const output = 'reconstruction.pdf'

async function compile() {
    return cotex.commands.sync()
        .then(() => {
            return axios({
                      url: url + '/projects/1/compile',
                      responseType: 'stream',
                      method: 'post',
                      data: {
                          output: output
                      }
                    }).then(function (res: any) {
                      res.data.pipe(fs.createWriteStream(output));
                });
        });
}
export { compile as cli, compile as api };