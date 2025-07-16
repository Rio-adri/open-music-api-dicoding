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
            type: 'VARCHAR(20)',
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
            type: 'VARCHAR(20)',
            notNull: false,
        }
    });

    pgm.addConstraint('songs', 'songs_albumid_fkey', {
        foreignKeys: {
            columns: 'albumid',
            references: 'albums(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropTable('songs');
};

module.exports = { up, down }