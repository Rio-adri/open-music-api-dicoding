/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
    pgm.createTable('songs', {
        id:{
            type: 'VARCHAR(50)',
            primaryKey:true,
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        year:{
            type: 'INT',
            notNull: true
        },
        performer: {
            type: 'TEXT',
            notNull: true,
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        duration: {
            type: 'INT',
            notNull: false
        },
        albumid: {
            type: 'VARCHAR(50)',
            notNull: false,
        }
    });

    pgm.addConstraint('songs', 'songs_albumid_fkey', 'FOREIGN KEY(albumid) REFERENCES albums(id) ON DELETE SET NULL ON UPDATE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropConstraint('songs', 'songs_albumid_fkey');
    pgm.dropTable('songs');
};

module.exports = { up, down }
