import axios from 'axios';
import * as fs from 'fs';
import * as dt from 'directory-tree';
import * as diff from 'json-diff';

async function sync() {
  const remoteIdx = (await axios.get('http://localhost:3000/projects/1/index')).data;
  const localIdx = dt('./', { exclude: /.cotex|.git|node_modules/, attributes: ['mtime'] });
  const diffFiles = diff.diff(remoteIdx,localIdx);

  fs.writeFileSync('test', JSON.stringify(diffFiles, null, 2));
  //console.log(diffFiles);
  /* diffFiles.children.forEach((object: any) => {
    axios.post('http://localhost:3000/1/sync', fs.readFileSync('./' + object.path),{
      headers: {
          filePath: object.name,
          'Content-Type': 'multipart/form-data'
      }
    })
  }); */
}
exports.api = sync;
exports.cli = sync;
