const autoBind = require('auto-bind');

class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        autoBind(this);
    }

    async postAuthenticationHandler(request, h) {
        this._validator.validatePostAuthenticationPayload(request.payload);

        const { username, password } = request.payload;

        const id = await this._usersService.verifyUserCredential(username, password);
        
        const accessToken = await this._tokenManager.createAccessToken({ id });
        const refreshToken = await this._tokenManager.createRefreshToken({ id });

        await this._authenticationsService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            data: {
                accessToken,
                refreshToken
            },
        });
        response.code(201);
        return response;
    }

    async putAuthenticationHandler(request, h) {
        this._validator.validatePutAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;

        await this._authenticationsService.verifyRefreshToken(refreshToken);
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

        const newAccessToken = this._tokenManager.createAccessToken({ id });

        const response = h.response({
            status: 'success',
            data: {
                accessToken : newAccessToken,
            }
        });

        response.code(200);
        return response;
    }

    async deleteAuthenticationHandler(request, h) {
        this._validator.validateDeleteAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;

        await this._authenticationsService.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Refresh token berhasil dihapus'
        });
        response.code(200);
        return response;
    }
}

module.exports = AuthenticationsHandler;