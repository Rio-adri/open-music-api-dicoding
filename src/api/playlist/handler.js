const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);

        const { name } = request.payload;
        const { id: userId } = request.auth.credentials;

        const playlistId = await this._service.addPlaylist({ name, userId });

        const response = h.response({
            status: 'success',
            data: {
                playlistId
            }
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request, h) {
        const { id: userId } = request.auth.credentials;

        const playlists = await this._service.getPlaylist(userId);

        const response = h.response({
            status: 'success',
            data: {
                playlists,
            },
        });

        response.code(200);
        return response;
    }

    async deletePlaylistHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner( playlistId, userId );
        await this._service.deletePlaylist(playlistId);

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    async postSongIntoPlaylistHandler(request, h) {
        this._validator.validatePlaylistSongsPayload(request.payload);

        const { id: userId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._service.verifyPlaylistAccess( playlistId, userId );
        await this._service.addSongIntoPlaylist({ playlistId, songId, userId });

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan'
        });

        response.code(201);
        return response;
    }

    async getSongsFromPlaylistHandler(request,h){
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess( playlistId, userId );
        const playlist = await this._service.getSongsFromPlaylist(playlistId);

        const response = h.response({
            status: 'success',
            data: {
                playlist
            }
        });

        response.code(200);
        return response;
    }

    async deleteSongFromPlaylistHandler(request, h) {
        this._validator.validatePlaylistSongsPayload(request.payload);

        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: userId } = request.auth.credentials; 

        await this._service.verifyPlaylistAccess(playlistId, userId);
        await this._service.deleteSongFromPlaylist(playlistId, songId, userId);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist anda'
        });

        response.code(200);
        return response;
    }
}

module.exports = PlaylistsHandler;