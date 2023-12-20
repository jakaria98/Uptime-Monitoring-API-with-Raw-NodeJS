/*
Title: Uptime Monitoring API / Initial File
Description: an API to monitor up or down time of user defined links
Author: Jakaria Hossain
*
*/
// Dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
// eslint-disable-next-line import/extensions
const environment = require('../.env');
const data = require('./data');
// app object - module scaffolding
const server = {};
// create server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle request response
server.handleReqRes = handleReqRes;
// start server
server.init = () => {    
    server.createServer();
}
// export module
module.exports = server;
