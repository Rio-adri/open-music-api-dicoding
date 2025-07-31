const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadImageHandler,
        options: {
            payload:{
                allow: 'multipart/form-data',
                parse: true,
                output: 'stream',
                multipart: true,
                maxBytes: 512000,
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file/images'),
                index: false,
            },
        },
    }
];

module.exports = routes;