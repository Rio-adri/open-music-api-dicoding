const { Pool } = require('pg');
const { nanoid } = require( 'nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbum } = require('../../utils/mapDBToModel');


class AlbumService {
    constructor () {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);
        
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Album Gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT a.id, a.name, a.year, s.id as song_id, s.title, s.performer FROM albums a LEFT JOIN songs s ON a.id = s.albumid WHERE a.id=$1',
            values:[id]
        }

        const resultQuery = await this._pool.query(query);

        if (!resultQuery.rows.length) {
            throw new NotFoundError('Id tidak ditemukan');
        }

        const result = mapDBToModelAlbum(resultQuery.rows)

        return result;
    }

    async editAlbum (id, { name, year }) {
        const query = {
            text: 'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
            values: [name, year, id],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal diupdate. Id tidak ditemukan');
        }
    }

    async deleteAlbum (id) {
        const query = {
            text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = AlbumService;
