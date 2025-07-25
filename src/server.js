require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// album
const albumPlugin = require('./api/album/index');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album/index');

// song
const songPlugin = require('./api/songs/index');
const SongService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/song/index');

// user
const userPlugin = require('./api/users/index');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users/index');

// authentication
const authenticationsPlugin = require('./api/authentication/index');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications/index');

// playlist
const playlistPlugin = require('./api/playlist/index');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists/index');

// collaborations
const collaborationPlugin = require('./api/collaborations/index');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations/index');

const ClientError = require("./exceptions/ClientError");

const init = async () => {
    const albumS = new AlbumService();
    const songS = new SongService();
    const userS = new UsersService();
    const authS = new AuthenticationsService();
    const collaborationsS = new CollaborationsService();
    const playlistsS = new PlaylistsService(collaborationsS);

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // plugin eksternal
    await server.register([
      {
        plugin: Jwt,
      }
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusicapi_jwt', 'jwt', {
      keys: process.env.ACCESS_TOKEN_KEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: process.env.ACCESS_TOKEN_AGE,
      },
      validate: (artifacts) => ({
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
        }
      }),
    })

    // plugin internal
    await server.register([
        {
          plugin: albumPlugin,
          options: { service: albumS, validator: AlbumValidator }
        },
        {
          plugin: songPlugin,
          options: { service: songS, validator: SongValidator }
        },
        {
          plugin: userPlugin,
          options: {service: userS, validator: UsersValidator }
        },
        {
          plugin: authenticationsPlugin,
          options: {authS, userS, tokenManager: TokenManager, validator: AuthenticationsValidator  }
        },
        {
          plugin: playlistPlugin,
          options: { service: playlistsS, validator: PlaylistValidator}
        },
        {
          plugin: collaborationPlugin,
          options: {collaborationsS, playlistsS, validator: CollaborationsValidator}
        }
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
    
        if (response instanceof Error) {
 
            if (response instanceof ClientError) {
              const newResponse = h.response({
                status: 'fail',
                message: response.message,
              });
              newResponse.code(response.statusCode);
              return newResponse;
            }
      
            if (!response.isServer) {
              return h.continue;
            }
      
            const newResponse = h.response({
              status: 'error',
              message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            console.log(response);
            return newResponse;
          }
    
        return h.continue;
    });    

    await server.start();

    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();