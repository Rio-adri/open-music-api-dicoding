const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, {collaborationsS, playlistsS, validator}) => {
        const collaborationsHandler = new CollaborationsHandler(collaborationsS, playlistsS, validator);
        server.route(routes(collaborationsHandler));
    }
}