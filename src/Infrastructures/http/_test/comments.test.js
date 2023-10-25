const container = require("../../container");
const createServer = require("../createServer");
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
describe('when POST /comments', () => {

    const UserData = {
        id: 'user-123',
        username: 'dicoding',
    }

    const ThreadData = {
        id: 'thread-123',
        title: 'dicoding',
        body: 'secret',
    }

    let accessToken;

    beforeAll(async () => {
        await UserTableTestHelper.addUser(UserData);
        await ThreadsTableTestHelper.postThread(ThreadData);
        accessToken = await ServerTestHelper.login(UserData);
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UserTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        pool.end();
    });

    it('should response 201 and persisted comment', async () => {
        const requestPayload = {
            content: 'secret',
        };

        const server = await createServer(container);
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
        const server = await createServer(container);
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

        const server = await createServer(container);
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

        const server = await createServer(container);
        const response = await server.inject({
            method: 'POST',
            url: `/threads/thread-321/comments`,
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

        const server = await createServer(container);
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