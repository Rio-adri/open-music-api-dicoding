const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("./../../exceptions/NotFoundError");
const AuthorizationError = require('./../../exceptions/AuthorizationError');
const { forPlaylist, forPlaylistSongs } = require("../../utils/mapDBToModel");

class PlaylistsService {
    constructor(collaborationService,activityService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
        this._activityService = activityService;
    }

    async addPlaylist({ name, userId }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, userId]
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('Gagal menambahkan playlist');
        }

        return result.rows[0].id;
    }

    async getPlaylist(userId) {
        const query = {
            text: 'SELECT p.*, u.username FROM playlists p LEFT JOIN collaborations c ON c.playlist_id = p.id LEFT JOIN users u ON u.id = p.owner WHERE p.owner=$1 OR c.user_id = $1 GROUP BY p.id, u.username',
            values: [userId],
        }

        const result = await this._pool.query(query);

        return result.rows.map(forPlaylist);
    }

    async deletePlaylist(playlistId) {
        const query = {
            text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
    }

    async verifyPlaylistOwner(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id=$1',
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if(playlist.owner !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async addSongIntoPlaylist({ playlistId, songId, userId }) {
        const songCheck = await this._pool.query({
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        });
    
        if (!songCheck.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

    
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        }


        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('Gagal menambahkan lagu');
        }

        await this._activityService.addActivity({ playlistId, songId, userId, action: 'add'});
    }

    async getSongsFromPlaylist(playlistId) {
        const query = {
            text: 'SELECT p.id, p.name, u.username, s.id AS song_id, s.title, s.performer FROM playlists p JOIN users u ON p.owner = u.id JOIN playlist_songs ps ON p.id = ps.playlist_id JOIN songs s ON ps.song_id = s.id WHERE p.id = $1',
            values: [playlistId]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan atau belum memiliki lagu');
        }
    
        return forPlaylistSongs(result.rows);
    }

    async deleteSongFromPlaylist(playlistId, songId, userId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE song_id=$1 RETURNING id',
            values: [songId]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }

        await this._activityService.addActivity({ playlistId, songId, userId, action: 'delete'});

    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch(error) {
            if(error instanceof NotFoundError) {
                throw error;
            }

            try {
                await this._collaborationService.verifyCollabolator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistsService;