const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class ActivitesService {
    constructor() {
        this._pool = new Pool();
    }

    async addActivity({ playlistId, songId, userId, action }) {
        const id = `activity-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_song_activities  VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, playlistId, songId, userId, action],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('Activity gagal ditambahkan');
        }
    }

    async getActivities(playlistId){
        const query = {
            text: 'SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activities psa JOIN users u ON psa.user_id = u.id JOIN songs s ON psa.song_id = s.id WHERE psa.playlist_id = $1 ORDER BY psa.time ASC',
            values:[playlistId]
        }

        const result = await this._pool.query(query);

        const { rowCount } = await this._pool.query(query);

        if(!rowCount) {
            throw new NotFoundError('Activity tidak ditemukan');
        }

        return result.rows;
    }
}

module.exports = ActivitesService;