const InvariantError = require("../../exceptions/InvariantError");
const { SongPayloadSchema, SongQuerySchema } = require("./schema");

const SongValidator = {
    validateSongPayload: (payload) => {
        const result = SongPayloadSchema.validate(payload);

        if (result.error) {
            throw new InvariantError(result.error.message);
        }

        return result;
    },
    validateSongQuery: (query) => {
        const result = SongQuerySchema.validate(query);

        if(result.error) {
            throw new Error(result.error.message);
        }

        return result;
    }
}

module.exports = SongValidator;