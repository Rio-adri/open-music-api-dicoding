/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });

    pgm.addConstraint('playlist_songs', 'playlist_songs_playlists_fk', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE ON UPDATE CASCADE' );

    pgm.addConstraint('playlist_songs', 'playlist_songs_songs_fk', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE ON UPDATE CASCADE' );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropConstraint('playlist_songs', 'playlist_songs_playlists_fk');
    pgm.dropConstraint('playlist_songs', 'playlist_songs_songs_fk');
    pgm.dropTable('playlist_songs');
};

module.exports = { up, down }
