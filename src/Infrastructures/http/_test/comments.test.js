const container = require('../../container');
const createServer = require('../createServer');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
  const UserData = {
    id: 'user-123',
    username: 'dicoding',
  };

  const otherUser = {
    id: 'user-321',
    username: 'dicoding 2',
  };

  const ThreadData = {
    id: 'thread-123',
    title: 'dicoding',
    body: 'secret',
  };

  let accessToken;
  let server;

  beforeAll(async () => {
    await UserTableTestHelper.addUser(UserData);
    await ThreadsTableTestHelper.postThread(ThreadData);
    accessToken = await ServerTestHelper.login(UserData);
    server = await createServer(container);
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UserTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /comments', () => {
    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'secret',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${ThreadData.id}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${ThreadData.id}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal menambahkan komentar. Mohon isi konten komentar');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        content: 123,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${ThreadData.id}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal menambahkan komentar karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not found', async () => {
      const requestPayload = {
        content: 'secret',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 401 when request authentication not contain access token', async () => {
      const requestPayload = {
        content: 'secret',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${ThreadData.id}/comments`,
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /comments/{commentId}', () => {
    const TEST_DATA = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'secret',
    };

    it('should response 200 and delete comment', async () => {
      await CommentsTableTestHelper.addComment({
        id: TEST_DATA.commentId,
        threadId: TEST_DATA.threadId,
        owner: TEST_DATA.owner,
      });
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${TEST_DATA.threadId}/comments/${TEST_DATA.commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when request from other user', async () => {
      await UserTableTestHelper.addUser(otherUser);

      await CommentsTableTestHelper.addComment({
        id: TEST_DATA.commentId,
        threadId: TEST_DATA.threadId,
        owner: otherUser.id,
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${TEST_DATA.threadId}/comments/${TEST_DATA.commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
    });

    it('should response 404 when comment not found', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${TEST_DATA.threadId}/comments/${TEST_DATA.commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });
  });
});
