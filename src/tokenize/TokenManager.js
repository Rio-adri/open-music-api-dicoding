const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
    createAccessToken: (id) => Jwt.token.generate(id, process.env.ACCESS_TOKEN_KEY),
    createRefreshToken: (id) => Jwt.token.generate(id, process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            const { payload } = artifacts.decoded;
            return payload;
          } catch (error) {
            throw new InvariantError('Refresh token tidak valid');
          }
    }
}

module.exports = TokenManager;