const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const PostThread = require("../../../Domains/threads/entities/PostThread");
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const PostedThread = require("../../../Domains/threads/entities/PostedThread");
const pool = require("../../database/postgres/pool");
describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('postThread function', () => {
        it('should persist new thread and return posted thread correctly', async () => {
            const threadData = {
                id: 'thread-123',
                title: 'title',
                body: 'body',
                owner: 'user-123',
            };

            await UserTableTestHelper.addUser({id: 'user-123'});
            const fakeIDGenerator = () => '123';
            const postThreadPayload = new PostThread(threadData);

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIDGenerator);

            const postedThread = await threadRepositoryPostgres.postThread(postThreadPayload);

            expect(postedThread).toStrictEqual(new PostedThread({
                id: threadData.id,
                title: threadData.title,
                owner: threadData.owner,
            }));
        });
    });
});