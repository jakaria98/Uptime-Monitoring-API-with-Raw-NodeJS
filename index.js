/*
Title: Server related file
Description: an API to monitor up or down time of user defined links / Server Related file
Author: Jakaria Hossain
*
*/
// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
// eslint-disable-next-line import/extensions
const environment = require('./.env');
const data = require('./lib/data');
const lib = require('./lib/data');
// app object - module scaffolding
const app = {};
// create server
app.init = () => {
    // start the server
    server.createServer();
    // start the workers
    workers.init();
};

// execute
app.init();
