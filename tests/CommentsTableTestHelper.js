const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async findCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT * FROM comments WHERE thread_id = '${threadId}'`,
        }

        const comments = await pool.query(query);
        return comments.rows;
    },
    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    }
}

module.exports = CommentsTableTestHelper;