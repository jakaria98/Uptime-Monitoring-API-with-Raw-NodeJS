/*
Title: Uptime Monitoring API
Description: an API to monitor up or down time of user defined links
Author: Jakaria Hossain
*
*/
// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
// eslint-disable-next-line import/extensions
const environment = require('./.env');
const data = require('./lib/data');
const lib = require('./lib/data');
// app object - module scaffolding
const app = {};
// testing file system
// @TODO delete this
// data.create('test', 'newFile', { name: 'Bangladesh', language: 'Bangla' }, (err) => {
//     console.log('Error was ', err);
// });
// // eslint-disable-next-line no-shadow
// data.read('test', 'newFile', (err, data) => {
//     console.log('Error was ', err, ' and data is ', data);
// });
// data.update('test', 'newFile', { name: 'America', language: 'English' }, (err) => {
//     console.log('Error was ', err);
// });
// lib.delete('test', 'newFile', (err) => {
//     console.log('Error was ', err);
// });
// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;
// start server
app.createServer();
