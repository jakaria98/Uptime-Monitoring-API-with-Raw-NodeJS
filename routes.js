const { sampleHandler } = require('./handler/routeHandlers/sampleHandler');
const { userHandler } = require('./handler/routeHandlers/userHandler');
const { tokenHandler } = require('./handler/routeHandlers/tokenHandler');
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};
module.exports = routes;
