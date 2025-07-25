/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

const { default: pg } = require('pg');

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
    pgm.createTable('playlist_song_activities', {
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
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        action: {
            type: 'TEXT',
            notNull: true,
        },
        time: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        }
    });

    pgm.createConstraint('playlist_song_activities', 'playlist_song_activities_and_playlists_fk', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE' );

    pgm.createConstraint('playlist_song_activities', 'playlist_song_activities_and_songs_fk', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE' );

    pgm.createConstraint('playlist_song_activities', 'playlist_song_activities_and_users_fk', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE' );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_and_playlists_fk');
    pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_and_songs_fk');
    pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_and_users_fk');
    pgm.dropTable('playlist_song_activities');
};

module.exports = { up, down }
