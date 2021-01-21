'use strict';
const cotex = require('./cotex.js');
const chokidar = require('chokidar');

function start() {
    return new Promise((resolve,reject) => {
        console.log('Starting CoTex...')
        cotex.commands['create-index']();

        chokidar.watch('.',{
            ignored: /(^|[\/\\])\..|node_modules/, // ignore dotfiles
            persistent: true,
            ignoreInitial: true
        }).on('all', (event, path) => {
            cotex.commands['create-index']();
        });          
    });
}
exports.cli = start;