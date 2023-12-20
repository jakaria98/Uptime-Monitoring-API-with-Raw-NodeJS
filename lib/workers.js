/*
Title: worker file
Description: an API to monitor up or down time of user defined links
Author: Jakaria Hossain
*
*/
// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { parse } = require('path');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
// app object - module scaffolding
const worker = {};

worker.gatherAllChecks = () => {
    // get all the checks
    const allChecks = data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                // read the check data
                data.read('checks', check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        // pass it to the check validator, and let that function continue or log error as needed
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log("Error reading one of the check's data");
                    }
                });
            });
        } else {
            console.log('Error: Could not find any checks to process');
        }
    });
};
// sanity-check the check-data
worker.validateCheckData = (originalCheckData) => {
    const originalData = originalCheckData;
    originalData.state =
        typeof originalCheckData.state === 'string' &&
        ['up', 'down'].indexOf(originalCheckData.state) > -1
            ? originalCheckData.state
            : 'down';
    originalData.lastChecked =
        typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0
            ? originalCheckData.lastChecked
            : false;
    // pass to the next process
    worker.performCheck(originalData);
};
// perform the check, send the originalCheckData and the outcome of the check process to the next step in the process
worker.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    const checkOutcome = {
        error: false,
        responseCode: false,
    };
    // mark that the outcome has not been sent yet
    let outcomeSent = false;
    // parse the hostname and the path out of the original check data
    const parsedUrl = new URL(`${originalCheckData.protocol}://${originalCheckData.url}`);
    const { hostname } = parsedUrl;
    const { path } = parsedUrl;
    // construct the request
    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeoutSeconds * 1000,
    };
    // instantiate the request object (using either the http or https module)
    const _moduleToUse = originalCheckData.protocol === 'http' ? http : https;
    const req = _moduleToUse.request(requestDetails, (res) => {
        // grab the status of the sent request
        const status = res.statusCode;
        // update the checkOutcome and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });
    req.on('error', (e) => {
        // update the checkOutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: e,
        };
        if (!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });
    req.on('timeout', () => {
        // update the checkOutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: 'timeout',
        };
        if (!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });
    // end the request
    req.end();
};
// process the check outcome, update the check data as needed, trigger an alert if needed

worker.processCheckOutcome = (originalCheckData, checkOutcome) => {
    // check if check outcome is up or down
    const state =
        !checkOutcome.error &&
        checkOutcome.responseCode &&
        originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
            ? 'up'
            : 'down';
    // decide if an alert is warranted
    const alertWarranted =
        originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
    // log the outcome
    const timeOfCheck = Date.now();
    worker.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);
    // update the check data
    const newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;
    // save the updates
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            // send the new check data to the next phase in the process if needed
            if (alertWarranted) {
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed');
            }
        } else {
            console.log('Error trying to save updates to one of the checks');
        }
    });
};
// timer to execute the worker-process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.init();
    }, 1000 * 60);
};
// init script
worker.init = () => {
    worker.gatherAllChecks();
};
// export module
module.exports = worker;
