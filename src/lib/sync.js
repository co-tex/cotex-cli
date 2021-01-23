'use strict';

const axios = require('axios');
const REMOTE_URL = 'http://localhost:5000';
const TOKEN = 'test';

function sync(localIndex) {
    return axios.get(REMOTE_URL + '/' + TOKEN + '/index');
}
exports.api = sync;
exports.cli = sync;