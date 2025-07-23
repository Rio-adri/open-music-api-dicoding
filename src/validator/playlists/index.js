const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistValidationPayloadSchema, PlaylistSongsValidationPayloadSchema }  = require('./schema');

const PlaylistsPayloadValidator = {
    validatePlaylistPayload: (payload) => {
        const result = PlaylistValidationPayloadSchema.validate(payload);

        if(result.error) {
            throw new InvariantError(result.error.message);
        }
    },
    validatePlaylistSongsPayload: (payload) => {
        const result = PlaylistSongsValidationPayloadSchema.validate(payload);

        if(result.error) {
            throw new InvariantError(result.error.message);
        }
    }
}

module.exports = PlaylistsPayloadValidator;