/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

const up = (pgm) => {
    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

const down = (pgm) => {
    pgm.dropTable('albums');
};

module.exports = { up, down }
