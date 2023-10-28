/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'test comment',
    threadId = 'thread-123',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, owner, threadId],
    };

    await pool.query(query);
  },

  async findCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT * FROM comments WHERE thread_id = '${threadId}'`,
    };

    const comments = await pool.query(query);
    return comments.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
