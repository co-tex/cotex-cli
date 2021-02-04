import { cotex }  from './cotex';
import { default as axios } from 'axios';
import fs = require('fs');
import { authHeader, getConfig } from './util';


async function compile(file?: string) {
  const config = getConfig();
 
  return cotex.commands.sync()
    .then(() => {
      return axios({
          url: config.get('url') + '/projects/' + config.get('projectId') + '/compile',
          method: 'post',
          data: {
            file: config.get('main')
          },
          headers: authHeader()
        })
    });
}
export { compile as cli, compile as api };
