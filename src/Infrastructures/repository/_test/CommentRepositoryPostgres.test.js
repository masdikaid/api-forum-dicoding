const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddedComment = require("../../../Domains/threads/entities/AddedComment");
const TEST_DATA = {
    id: 'comment-123',
    content: 'test comment',
    owner: 'user-123',
    threadId: 'thread-123',
}

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({id: TEST_DATA.owner});
        await ThreadsTableTestHelper.postThread({id: TEST_DATA.threadId, owner: TEST_DATA.owner});
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await pool.end();
    });

    it('should persist comment and return comment correctly', async () => {
        const commentPayload = {
            content: TEST_DATA.content,
        }

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
        const comment = await commentRepositoryPostgres.addComment(commentPayload, TEST_DATA.threadId, TEST_DATA.owner);
        const comments = await CommentsTableTestHelper.findCommentsByThreadId(TEST_DATA.threadId);
        expect(comments).toHaveLength(1);
        expect(comment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: TEST_DATA.content,
            owner: TEST_DATA.owner,
        }));
    });
});