const autoBind = require('auto-bind');

class AlbumHandler {
    constructor (service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postAlbumHandler (request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year }  = request.payload;

        const albumid = await this._service.addAlbum({ name, year });

        const response = h.response({
            status: 'success',
            data: {
                albumId: albumid,
            }
        });

        response.code(201);
        return response;
    }

    async getAlbumByIdHandler (request, h) {
        const { id } = request.params;

        const album = await this._service.getAlbumById(id);

        const response = h.response({
            status: 'success',
            data: {
                album,
            }
        });

        response.code(200);
        return response;
    }

    async putAlbumHandler (request, h){
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;

        await this._service.editAlbum(id, request.payload);

        const response = h.response({
            status: 'success',
            message: 'Album berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    async deleteAlbumHandler (request, h){
        const { id } = request.params;

        await this._service.deleteAlbum(id);

        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });

        response.code(200);
        return response;
    }

    async postAlbumLikesHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._service.addAlbumLikes(userId, albumId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menyukai album',
        });

        response.code(201);
        return response;
    }

    async getAlbumLikesHandler(request,h) {
        const { id: albumId } = request.params;

        const result = await this._service.getAlbumLikes(albumId);

        const response = h.response({
            status: 'success',
            data: {
                likes: result.data,
            }
        });

        if (result.source === 'cache') {
            response.header('X-Data-Source', 'cache');
        }

        response.code(200);

        return response;
    }

    async deleteAlbumLikesHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._service.deleteLikes(userId, albumId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil batal like',
        });
        response.header('X-Data-Source', 'cache');
        response.code(200);
        return response;
    }
}

module.exports = AlbumHandler;