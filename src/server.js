require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./utils/config');

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

// activities
const activitiesPlugin = require('./api/activities/index');
const ActivitesService = require('./services/postgres/ActivitiesService');

// exports
const exportsPlugin = require('./api/exports/index');
const producerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports/index');

// uploads
const uploadsPlugin = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheService = require('./services/redis/CacheService');


const ClientError = require("./exceptions/ClientError");

const init = async () => {
    const cacheService = new CacheService();
    const albumS = new AlbumService(cacheService);
    const songS = new SongService();
    const userS = new UsersService();
    const authS = new AuthenticationsService();
    const collaborationsS = new CollaborationsService();
    const activitiesS = new ActivitesService();
    const playlistsS = new PlaylistsService(collaborationsS, activitiesS);
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

    const server = Hapi.server({
        port: config.app.port,
        host: config.app.host,
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
      },
      {
        plugin: Inert,
      }
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusicapi_jwt', 'jwt', {
      keys: config.jwt.key,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: config.jwt.age,
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
        },
        {
          plugin: activitiesPlugin,
          options: { activitiesS, playlistsS }
        },
        {
          plugin: exportsPlugin,
          options: { producerService, playlistsService: playlistsS, validator: ExportsValidator }
        },
        {
          plugin: uploadsPlugin,
          options: {
            storageService,
            albumsService: albumS,
            validator: UploadsValidator,
          },
        },
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