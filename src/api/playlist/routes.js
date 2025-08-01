const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
            auth: 'openmusicapi_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt'
        }
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postSongIntoPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getSongsFromPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deleteSongFromPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt'
        }
    },
];

module.exports = routes;