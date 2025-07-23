/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });

    pgm.addConstraint('playlists', 'playlist_users_fk', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropConstraint('playlists', 'playlist_users_fk');
    pgm.dropTable('playlists');
};

module.exports = { up, down }
