const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler,
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumByIdHandler,
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumHandler,
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumHandler,
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postAlbumLikesHandler,
        options: {
            auth: 'openmusicapi_jwt',
        }
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.deleteAlbumLikesHandler,
        options: {
            auth: 'openmusicapi_jwt',
        }
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getAlbumLikesHandler,
    }
];

module.exports = routes;