/**
 * Title: Utilities
 * Description: Important utility functions
 * Author: Jakaria Hossain
 */
// dependencies
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
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
};
module.exports = utilities;
