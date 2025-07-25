const ActivitiesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'activities',
    version: '1.0.0',
    register: async(server, { activitiesS, playlistsS }) => {
        const activitiesHandler = new ActivitiesHandler(activitiesS, playlistsS);
        server.route(routes(activitiesHandler));
    }
}

