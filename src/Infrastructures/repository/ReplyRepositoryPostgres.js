const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply, commentId, owner) {
    const { content } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.*, users.username FROM replies LEFT JOIN users ON replies.owner = users.id WHERE comment_id = $1 ORDER BY replies.date ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailReply(row));
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new Error('VERIFY_REPLY.NOT_FOUND');
    }
    if (result.rows[0].owner !== owner) {
      throw new Error('VERIFY_REPLY.OWNER_NOT_MATCH');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET deleted_at = NOW() WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
