'use strict';

const fs = require('fs');
const dirTree = require('directory-tree');

function createIndex() {
    if(!fs.existsSync('.cotex')) {
        const err = new Error(`Usage: run 'cotex init' first!`);
        err.type = 'EUSAGE';
        throw err;
    }

    const index = dirTree('./', { exclude: /.cotex|.git|node_modules/, attributes: ['mtime'] });
    fs.writeFileSync('.cotex/index.json', JSON.stringify(index, null, 2));
}

function cli() {
    return new Promise((resolve,reject) => {
        createIndex();
    });
}

function api() {
    createIndex();
}
exports.api = api;
exports.cli = cli;
