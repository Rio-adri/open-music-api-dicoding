const { Pool } = require('pg');
const { nanoid } = require( 'nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSong } = require('../../utils/mapDBToModel');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, performer, genre, duration, albumId }) {
        const id = nanoid(16);
        
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Lagu Gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs({ title, performer }) {
        const conditions = [];
        const values = [];
    
        if (title) {
            values.push(`%${title.toLowerCase()}%`);
            conditions.push(`LOWER(title) LIKE $${values.length}`);
        }
    
        if (performer) {
            values.push(`%${performer.toLowerCase()}%`);
            conditions.push(`LOWER(performer) LIKE $${values.length}`);
        }
    
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const query = {
            text: `SELECT id, title, performer FROM songs ${whereClause}`,
            values
        }

        const result = await this._pool.query(query);

        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id=$1',
            values:[id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Id tidak ditemukan');
        }

        return result.rows.map(mapDBToModelSong)[0];
    }

    async editSong (id, { title, year, performer, genre, duration, albumId }) {
        const query = {
            text: 'UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, albumid=$6 WHERE id=$7 RETURNING id',
            values: [title, year, performer, genre, duration, albumId, id],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal diupdate. Id tidak ditemukan');
        }
    }

    async deleteSong (id) {
        const query = {
            text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = SongsService;