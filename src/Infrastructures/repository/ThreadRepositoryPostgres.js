const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const PostedThread = require("../../Domains/threads/entities/PostedThread");
const DetailThread = require("../../Domains/threads/entities/DetailThread");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async postThread(newThread, owner) {
        const {title, body} = newThread;
        const id = `thread-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, title, body, owner],
        };

        const result = await this._pool.query(query);
        return new PostedThread({...result.rows[0]});
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT threads.*, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return new DetailThread({...result.rows[0]});
    }

    async verifyThread(threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);
        
        if (!result.rowCount) {
            throw new Error('THREAD_REPOSITORY.NOT_FOUND');
        }
    }
}

module.exports = ThreadRepositoryPostgres;