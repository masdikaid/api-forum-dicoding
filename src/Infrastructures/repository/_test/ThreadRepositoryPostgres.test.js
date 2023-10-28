const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const pool = require('../../database/postgres/pool');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

const THREAD_DATA = {
  id: 'thread-123',
  title: 'title',
  body: 'body',
  owner: 'user-123',
  username: 'dicoding',
};

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postThread function', () => {
    it('should persist new thread and return posted thread correctly', async () => {
      await UserTableTestHelper.addUser({
        id: THREAD_DATA.owner,
        username: THREAD_DATA.username,
      });
      const fakeIDGenerator = () => '123';
      const postThreadPayload = new PostThread(THREAD_DATA);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIDGenerator);

      const postedThread = await threadRepositoryPostgres.postThread(
        postThreadPayload,
        THREAD_DATA.owner,
      );

      expect(postedThread)
        .toStrictEqual(new PostedThread({
          id: THREAD_DATA.id,
          title: THREAD_DATA.title,
          owner: THREAD_DATA.owner,
        }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      await UserTableTestHelper.addUser({ id: THREAD_DATA.owner });
      await ThreadsTableTestHelper.postThread(THREAD_DATA);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const thread = await threadRepositoryPostgres.getThreadById(THREAD_DATA.id);

      expect(thread)
        .toStrictEqual(new DetailThread({
          id: THREAD_DATA.id,
          title: THREAD_DATA.title,
          body: THREAD_DATA.body,
          date: thread.date,
          username: THREAD_DATA.username,
        }));
    });
  });

  describe('verifyThread function', () => {
    it('should throw error when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .rejects
        .toThrowError('THREAD_REPOSITORY.NOT_FOUND');
    });

    it('should not throw error when thread found', async () => {
      await UserTableTestHelper.addUser({ id: THREAD_DATA.owner });
      await ThreadsTableTestHelper.postThread(THREAD_DATA);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .resolves
        .not
        .toThrowError('THREAD_REPOSITORY.NOT_FOUND');
    });
  });
});
