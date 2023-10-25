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

    async verifyCommentOwner(commentId, owner) {
        const query = {
            text: 'SELECT owner FROM comments WHERE id = $1 AND deleted_at IS NULL',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('VERIFY_COMMENT.NOT_FOUND');
        }
        if (result.rows[0].owner !== owner) {
            throw new Error('VERIFY_COMMENT.OWNER_NOT_MATCH');
        }
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET deleted_at = NOW() WHERE id = $1',
            values: [commentId],
        }

        await this._pool.query(query);
    }
}

module.exports = CommentRepositoryPostgres;