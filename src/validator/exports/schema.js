const Joi = require('joi');

const  ExportsPlaylistsPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportsPlaylistsPayloadSchema;