const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

const TEST_DATA = {
  id: 'comment-123',
  content: 'test comment',
  owner: 'user-123',
  threadId: 'thread-123',
};

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: TEST_DATA.owner });
    await ThreadsTableTestHelper.postThread({
      id: TEST_DATA.threadId,
      owner: TEST_DATA.owner,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('add comment', () => {
    it('should persist comment and return comment correctly', async () => {
      const commentPayload = {
        content: TEST_DATA.content,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const comment = await commentRepositoryPostgres.addComment(
        commentPayload,
        TEST_DATA.threadId,
        TEST_DATA.owner,
      );
      const comments = await CommentsTableTestHelper.findCommentsByThreadId(TEST_DATA.threadId);
      expect(comments)
        .toHaveLength(1);
      expect(comment)
        .toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: TEST_DATA.content,
          owner: TEST_DATA.owner,
        }));
    });
  });

  describe('verify comment owner', () => {
    it('should throw error when comment not found', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-321', TEST_DATA.owner))
        .rejects
        .toThrowError('VERIFY_COMMENT.NOT_FOUND');
    });

    it('should throw error when owner not match', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment(TEST_DATA);
      await expect(commentRepositoryPostgres.verifyCommentOwner(TEST_DATA.id, 'user-321'))
        .rejects
        .toThrowError('VERIFY_COMMENT.OWNER_NOT_MATCH');
    });

    it('should not throw error when owner match', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment(TEST_DATA);
      await expect(commentRepositoryPostgres.verifyCommentOwner(TEST_DATA.id, TEST_DATA.owner))
        .resolves
        .not
        .toThrowError('VERIFY_COMMENT.OWNER_NOT_MATCH');
    });
  });

  describe('get comments by thread id', () => {
    it('should return comments correctly', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment(TEST_DATA);
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(TEST_DATA.threadId);
      const comment = comments[0];
      expect(comments)
        .toHaveLength(1);
      expect(comment)
        .toStrictEqual(new DetailComment({
          id: TEST_DATA.id,
          content: TEST_DATA.content,
          username: 'dicoding',
          date: comment.date,
        }));
    });
  });

  describe('verify comment', () => {
    it('should throw error when comment not found', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await expect(commentRepositoryPostgres.verifyComment('comment-321'))
        .rejects
        .toThrowError('VERIFY_COMMENT.NOT_FOUND');
    });

    it('should not throw error when comment found', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment(TEST_DATA);
      await expect(commentRepositoryPostgres.verifyComment(TEST_DATA.id))
        .resolves
        .not
        .toThrowError('VERIFY_COMMENT.NOT_FOUND');
    });
  });

  describe('delete comment', () => {
    it('should soft delete comment', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await CommentsTableTestHelper.addComment(TEST_DATA);
      await commentRepositoryPostgres.deleteComment(TEST_DATA.id);
      const comments = await CommentsTableTestHelper.findCommentsByThreadId(TEST_DATA.threadId);
      expect(comments[0].deleted_at)
        .not
        .toBeNull();
    });
  });
});
