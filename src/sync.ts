import axios from 'axios';
import * as fs from 'fs';
import * as dt from 'directory-tree';
import * as diff from 'json-diff';
import * as FormData from 'form-data';

async function sync() {
  const remoteIdx = (await axios.get('http://localhost:3000/projects/1/index')).data;
  const localIdx: any = {};
  dt('./', { exclude: /.cotex|.git|node_modules/, attributes: ['mtime'] }, (file,path,stats) => {
    localIdx[file.path] = file;
  });
  const diffFiles =  diff.diff(remoteIdx,localIdx);
  for(let fname in diffFiles) {

    // upload
    if(fname.split('__').pop() === 'added') {
      const form = new FormData();
      
      const fileStream = fs.createReadStream('./' + diffFiles[fname].path)
      const idx = diffFiles[fname].path.lastIndexOf(diffFiles[fname].name);
      let path = '';

      if(idx > 0 ) {
        path = diffFiles[fname].path.slice(0,idx - 1);
      }
      form.append('path', path);
      form.append('file', fileStream);
      
      axios.post('http://localhost:3000/projects/1/sync', form,{
        headers: form.getHeaders()
      });
    }
    // upload
    else if(diffFiles[fname].mtime.__old ){
      const oldDate = Date.parse(diffFiles[fname].mtime.__old);
      const newDate = Date.parse(diffFiles[fname].mtime.__new);

      if(oldDate < newDate ) {
        
      const form = new FormData();

      const fileStream = fs.createReadStream('./' + fname)
      const idx = fname.lastIndexOf(localIdx[fname].name);
      let path = '';

      if(idx > 0 ) {
        path = fname.slice(0,idx - 1);
      }
      form.append('path', path);
      form.append('file', fileStream);
      
      axios.post('http://localhost:3000/projects/1/sync', form,{
        headers: form.getHeaders()
      });

      }
    
    }
  }
}
exports.api = sync;
exports.cli = sync;
