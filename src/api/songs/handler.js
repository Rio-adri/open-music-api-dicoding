const autoBind = require('auto-bind');

class SongsHandler {
    constructor (service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postSongHandler (request, h) {
        this._validator.validateSongPayload(request.payload);
        const { title, year, performer, genre, duration, albumId }  = request.payload;

        const songId = await this._service.addSong({ title, year, performer, genre, duration, albumId });

        const response = h.response({
            status: 'success',
            data: {
                songId,
            }
        });

        response.code(201);
        return response;
    }

    async getSongsHandler (request, h) {

        await this._validator.validateSongQuery(request.query);
        const { title = '', performer = '' } = request.query;
        const songs = await this._service.getSongs({ title, performer });

        const response = h.response({
            status: 'success',
            data: {
                songs,
            }
        });
        response.code(200);
        return response;
    }

    async getSongByIdHandler (request, h) {
        const { id } = request.params;

        const song = await this._service.getSongById(id);

        const response = h.response({
            status: 'success',
            data: {
                song,
            }
        });

        response.code(200);
        return response;
    }

    async putSongHandler (request, h){
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;

        await this._service.editSong(id, request.payload);

        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        };
    }

    async deleteSongHandler (request, h){
        const { id } = request.params;

        await this._service.deleteSong(id);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

module.exports = SongsHandler;