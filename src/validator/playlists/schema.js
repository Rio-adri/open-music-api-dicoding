const Joi = require('joi');

const PlaylistValidationPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

const PlaylistSongsValidationPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = { PlaylistValidationPayloadSchema, PlaylistSongsValidationPayloadSchema }