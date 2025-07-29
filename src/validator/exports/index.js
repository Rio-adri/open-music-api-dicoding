const ExportsPlaylistsPayloadSchema = require("./schema");
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
    validateExportPlaylistsPayload: (payload) => {
        const result = ExportsPlaylistsPayloadSchema.validate(payload);

        if(result.error) {
            throw new InvariantError(result.error.message);
        }
    }
}

module.exports = ExportsValidator;