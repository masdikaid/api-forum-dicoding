/* eslint-disable camelcase */

const {PgLiteral} = require("node-pg-migrate");

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
        },
        content: {
        type: 'TEXT',
        notNull: true,
        },
        date: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('NOW()')
        },
        owner: {
        type: 'VARCHAR(50)',
        notNull: true,
        },
        thread_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        },
        deleted_at: {
        type: 'TIMESTAMP',
        }
    });

    pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('comments');
};