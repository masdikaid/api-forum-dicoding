const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");

const UserData = {
    id: 'user-123',
    username: 'dicoding',
}

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UserTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {

            const requestPayload = {
                title: 'dicoding',
                body: 'secret',
            };

            const server = await createServer(container);

            await UserTableTestHelper.addUser(UserData);
            const accessToken = await ServerTestHelper.login(UserData);
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: requestPayload,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.data.addedThread).toBeDefined();
        });
    });
});