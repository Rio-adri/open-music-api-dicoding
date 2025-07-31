const InvariantError = require('../../exceptions/InvariantError');
const { ImagesValidatorSchema } = require('./schema');
 
const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImagesValidatorSchema.validate(headers);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
 
module.exports = UploadsValidator;