const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async(server, { authS, userS, tokenManager, validator}) => {
        const authenticationsHandler = new AuthenticationsHandler(authS, userS, tokenManager, validator);

        server.route(routes(authenticationsHandler));
    }

}