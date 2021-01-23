'use strict';
const cotex = require('./cotex.js');
const chokidar = require('chokidar');
const express = require('express');
const bs = require("browser-sync").create();
const path = require('path');
const { default: axios } = require('axios');
const fs = require('fs');

function start() {
    return new Promise((resolve,reject) => {
        console.log('Starting CoTex remote compilation...')
        console.log('Testing the remote URL at ' + 'http://localhost:3000\n\n');

        cotex.commands['create-index']();
   
        chokidar.watch('.',{
            ignored: /(^|[\/\\])\..|node_modules|output.pdf/,
            persistent: true,
            ignoreInitial: true
        }).on('all', (event, path) => {
            cotex.commands['create-index']();
            axios({
                url: 'http://localhost:5000/compile',
                responseType: 'stream',
                method: 'GET'
            }).then(function(res) {
                res.data.pipe(fs.createWriteStream("output.pdf"));        
            });
        });
        
        console.log('Starting the local preview server...')
        const app = express();
        const port = 4000;
        
        app.get('/', (req, res) => {
            res.sendFile( path.resolve(__dirname + '/../') + '/www/preview.html');
        })

    
        app.get('/output', (req, res) => {
            res.sendFile('/output.pdf', { root: process.cwd() });
        })

        app.listen(port, () => {
            bs.watch(process.cwd() + '/output.pdf').on("change", bs.reload);
            // Start a Browsersync proxy
            bs.init({
                proxy: "http://localhost:4000",
                debugInfo: false,
            });
            console.log(`Live Preview at http://localhost:3000\n`);
            console.log(`Download the output at http://localhost:3000/output\n`);
        
        })
        
        
    });
}
exports.cli = start;