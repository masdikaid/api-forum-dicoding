const CommentRepository = require("../../Domains/threads/CommentRepository");
const AddedComment = require("../../Domains/threads/entities/AddedComment");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(addComment, threadId, owner) {
        const {content} = addComment;
        const id = `comment-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, owner, threadId],
        }

        const result = await this._pool.query(query);
        return new AddedComment(result.rows[0]);
    }
}

module.exports = CommentRepositoryPostgres;