const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumByIdHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    }
];

module.exports = routes;