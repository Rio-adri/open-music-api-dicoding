const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongByIdHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    }
];

module.exports = routes;