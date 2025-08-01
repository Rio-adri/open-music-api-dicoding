const Jwt = require('@hapi/jwt');
const config = require('../utils/config');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
    createAccessToken: (payload) => Jwt.token.generate(payload, config.jwt.key),
    createRefreshToken: (payload) => Jwt.token.generate(payload, config.jwt.refresh),
    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, config.jwt.refresh);
            const { payload } = artifacts.decoded;
            return payload;
          } catch {
            throw new InvariantError('Refresh token tidak valid');
          }
    }
}

module.exports = TokenManager;