import axios from 'axios';
import * as fs from 'fs';
import * as diff from 'json-diff';
import * as FormData from 'form-data';
import { index, changeSet, getConfig, authHeader } from './util';
import { grey, red } from 'chalk';

async function sync() {
  const config = getConfig();
  const root = config.get('root');
  const url = config.get('url');
  const projectId = config.get('projectId');

  if(!projectId) {
    console.log(red('Remote project is not set up!'));
    console.log('Run: ' + grey('cotex remote'));
  }
  let localIdx: any;
  let remoteIdx: any;

  return index(root).then((index) => {
    localIdx = index;
    return axios.get(url + '/projects/' + projectId + '/index', {
      headers: authHeader()
    });
  }).then((response)=> {
    remoteIdx = response.data;
    const df =  diff.diff(remoteIdx,localIdx);
    const changes = changeSet(df);
    
    changes.added.forEach(async (element: any) => {
      const form = new FormData();
      const fileStream = fs.createReadStream(root + '/' + element.path);
      form.append('dir', element.dir);
      form.append('file', fileStream);
      await axios.post(url + '/projects/'+ projectId + '/upload', form, {
        headers: {...form.getHeaders(), ...authHeader()}
      });
    });
    
    changes.modified.forEach(async (element: any) => {
      const form = new FormData();
      const fileStream = fs.createReadStream(root + '/' + element.path);
      form.append('dir', element.dir);
      form.append('file', fileStream);
      await axios.post(url + '/projects/' + projectId + '/upload', form, {
        headers: {...form.getHeaders(),...authHeader()}
      });
    });

    changes.deleted.forEach(async (element: any) => {
      axios.post(url + '/projects/' + projectId + '/delete', changes.deleted, {
        headers: authHeader()
      });
    });
  });
}
exports.api = sync;
exports.cli = sync;
