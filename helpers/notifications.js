/**
 * Title: Notifications
 * Description: Notifications helper
 * Author: Jakaria Hossain
 */

// dependencies
const https = require('https');
const { twilio } = require('../.env');

// module scaffolding
const notifications = {};
// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
    // input validation
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;

    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };

        // stringify the payload
        const stringifyPayload = JSON.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSID}/Messages.json`,
            auth: `${twilio.accountSID}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringifyPayload),
            },
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        // add the payload
        req.write(stringifyPayload);
        // end the request
        req.end();
    } else {
        callback('Given parameters were missing or invalid!');
    }
};

module.exports = notifications;
