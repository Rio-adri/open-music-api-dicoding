const autoBind = require('auto-bind');

class ActivitiesHandler {
    constructor (activitesService, playlistService) {
        this._playlistService = playlistService
        this._activitiesService = activitesService;

        autoBind(this);
    }

    async getActivitiesHandler (request, h) {
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._playlistService.verifyPlaylistOwner(playlistId,userId);
        const activities = await this._activitiesService.getActivities(playlistId);

        const response = h.response({
            status: 'success',
            data: {
                playlistId,
                activities,
            }
        });

        response.code(200);
        return response;
    }

    
}

module.exports = ActivitiesHandler;