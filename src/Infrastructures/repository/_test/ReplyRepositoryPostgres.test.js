const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedReply = require('../../../Domains/threads/entities/AddedReply');

const TEST_DATA = {
  id: 'reply-123',
  commentId: 'comment-123',
  content: 'test reply',
  owner: 'user-123',
  threadId: 'thread-123',
  body: 'test thread',
};

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: TEST_DATA.owner });
    await ThreadTableTestHelper.postThread({
      id: TEST_DATA.threadId,
      owner: TEST_DATA.owner,
    });
    await CommentsTableTestHelper.addComment({
      id: TEST_DATA.commentId,
      owner: TEST_DATA.owner,
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('add reply', () => {
    it('should persist reply and return reply correctly', async () => {
      const replyPayload = {
        content: TEST_DATA.content,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const reply = await commentRepositoryPostgres.addReply(
        replyPayload,
        TEST_DATA.commentId,
        TEST_DATA.owner,
      );
      const replies = await RepliesTableTestHelper.findRepliesByCommentId(TEST_DATA.commentId);
      expect(replies)
        .toHaveLength(1);
      expect(reply)
        .toStrictEqual(new AddedReply({
          id: TEST_DATA.id,
          content: TEST_DATA.content,
          owner: TEST_DATA.owner,
        }));
    });
  });

  describe('verify reply owner', () => {
    it('should throw error when reply not found', async () => {
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await expect(replyRepositoryPostgres.verifyReplyOwner('comment-321', TEST_DATA.owner))
        .rejects
        .toThrowError('VERIFY_REPLY.NOT_FOUND');
    });

    it('should throw error when owner not match', async () => {
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply(TEST_DATA);
      await expect(replyRepositoryPostgres.verifyReplyOwner(TEST_DATA.id, 'user-321'))
        .rejects
        .toThrowError('VERIFY_REPLY.OWNER_NOT_MATCH');
    });
  });

  describe('get replies by comment id', () => {
    it('should return replies correctly', async () => {
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply(TEST_DATA);
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(TEST_DATA.commentId);
      expect(replies)
        .toHaveLength(1);
      expect(replies[0].id)
        .toStrictEqual(TEST_DATA.id);
    });
  });

  describe('delete reply', () => {
    it('should soft delete reply', async () => {
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await RepliesTableTestHelper.addReply(TEST_DATA);
      await replyRepositoryPostgres.deleteReply(TEST_DATA.id);
      const replies = await RepliesTableTestHelper.findRepliesByCommentId(TEST_DATA.commentId);
      expect(replies[0].deleted_at)
        .not
        .toBeNull();
    });
  });
});
