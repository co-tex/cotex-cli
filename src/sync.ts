import axios from 'axios';
import * as fs from 'fs';
import * as diff from 'json-diff';
import * as FormData from 'form-data';
import { findRoot, isProject, index, changeSet } from './util';
import { exit } from 'process';
import { grey, red } from 'chalk';
import Configstore = require('configstore');

async function sync() {
  const currentPath = process.cwd();
  if(!isProject(currentPath)) {
    console.log(red('Not a CoTex project.'))
    console.log('Run: ' + grey('cotex init'));
    exit();
  }

  const rootPath = findRoot(currentPath);
  const cs = new Configstore('cotex-cli',{}, { configPath: rootPath + '/.cotex/config.json'});
  let localIdx: any;
  let remoteIdx: any;

  return index(rootPath).then((index) => {
    localIdx = index;
    return axios.get(cs.get('url') + '/projects/1/index');
  }).then((response)=> {
    remoteIdx = response.data;
    const df =  diff.diff(remoteIdx,localIdx);
    const changes = changeSet(df);
    console.log(changes);
    
    changes.added.forEach(async (element: any) => {
      const form = new FormData();
      const fileStream = fs.createReadStream(rootPath + '/' + element.path);
      form.append('dir', element.dir);
      form.append('file', fileStream);
      await axios.post(cs.get('url') + '/projects/1/upload', form, {
        headers: form.getHeaders()
      });
    });
    
    changes.modified.forEach(async (element: any) => {
      const form = new FormData();
      const fileStream = fs.createReadStream(rootPath + '/' + element.path);
      form.append('dir', element.dir);
      form.append('file', fileStream);
      await axios.post(cs.get('url') + '/projects/1/upload', form, {
        headers: form.getHeaders()
      });
    });

    changes.deleted.forEach(async (element: any) => {
      axios.post(cs.get('url') + '/projects/1/delete', changes.deleted);
    });
  });
}
exports.api = sync;
exports.cli = sync;
