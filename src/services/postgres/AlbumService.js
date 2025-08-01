const { Pool } = require('pg');
const { nanoid } = require( 'nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbum } = require('../../utils/mapDBToModel');


class AlbumService {
    constructor (cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        
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
            text: 'SELECT a.id, a.name, a.year, a.cover, s.id as song_id, s.title, s.performer FROM albums a LEFT JOIN songs s ON a.id = s.albumid WHERE a.id=$1',
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

    async addCoverAlbum(id, url) {
        const query = {
            text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
            values: [url, id]
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }
    }

    async addAlbumLikes(userId, albumId) {
        const checkLike = {
            text: 'SELECT * FROM user_album_likes WHERE user_id=$1 AND album_id = $2',
            values: [userId, albumId],
        }

        const checkResult = await this._pool.query(checkLike);
        if(checkResult.rows.length > 0) {
            throw new InvariantError('Anda hanya bisa menyukai album yang sama sebanyak 1 kali')
        }

        const checkAlbum = {
            text: 'SELECT 1 FROM albums WHERE id = $1',
            values: [albumId],
        };
        const albumResult = await this._pool.query(checkAlbum);

        if (albumResult.rows.length === 0) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const id = `likes-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('Gagal menyukai album');
        }

        await this._cacheService.delete(`album_likes:${albumId}`);
    }

    async getAlbumLikes(albumId) {
        try {
            const result = await this._cacheService.get(`album_likes:${albumId}`);
            return {
                source: 'cache',
                data: JSON.parse(result),
            };

        } catch {
            const query = {
                text: 'SELECT COUNT(id)::int as likes FROM user_album_likes WHERE album_id = $1',
                values: [albumId]
            }
    
            const result = await this._pool.query(query);
    
            await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(result.rows[0].likes));
    
            return {
                source: 'db',
                data: result.rows[0].likes,
            }
        }
    }

    async deleteLikes(userId, albumId) {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId]
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Gagal menghapus like. Album tidak ditemukan');
        }

        await this._cacheService.delete(`album_likes:${albumId}`);
    }
}

module.exports = AlbumService;
