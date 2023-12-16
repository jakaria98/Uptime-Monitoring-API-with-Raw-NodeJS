const { sampleHandler } = require('./handler/routeHandlers/sampleHandler');
const { userHandler } = require('./handler/routeHandlers/userHandler');
const routes = {
    sample: sampleHandler,
    user: userHandler,
};
module.exports = routes;
