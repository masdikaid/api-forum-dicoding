const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment, threadId, owner) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, threadId],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.*, users.username FROM comments LEFT JOIN users ON comments.owner = users.id WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailComment(row));
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
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

  async verifyComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new Error('VERIFY_COMMENT.NOT_FOUND');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET deleted_at = NOW() WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async isCommentLikedByUser(commentId, userId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND liker = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return !!result.rowCount;
  }

  async likeComment(commentId, userId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await this._pool.query(query);
  }

  async unlikeComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND liker = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async getCommentLikesCount(commentId) {
    const query = {
      text: 'SELECT COUNT(comment_id) AS likes FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].likes, 10);
  }
}

module.exports = CommentRepositoryPostgres;
