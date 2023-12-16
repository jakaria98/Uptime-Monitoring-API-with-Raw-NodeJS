const crypto = require('crypto');
const config = require('../.env');
// module scaffolding
const utilities = {};
// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};
// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length) {
        const hash = crypto.createHmac('sha256', config.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};
module.exports = utilities;
