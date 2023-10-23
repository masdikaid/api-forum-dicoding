const PostedThread = require("../../../../Domains/threads/entities/PostedThread");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const PostThreadUseCase = require("../PostThreadUseCase");
const PostThread = require("../../../../Domains/threads/entities/PostThread");
describe('PostThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {

        const ThreadData = {
            id: 'thread-123',
            title: 'dicoding',
            body: 'secret',
            owner: 'user-123',
        };

        const useCasePayload = new PostThread({
            title: ThreadData.title,
            body: ThreadData.body,
        });

        const mockPostedThread = new PostedThread({
            id: ThreadData.id,
            title: ThreadData.title,
            owner: ThreadData.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.postThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockPostedThread));

        const postThreadUseCase = new PostThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        const registeredThread = await postThreadUseCase.execute(useCasePayload, ThreadData.owner);

        expect(registeredThread).toStrictEqual(new PostedThread({
            id: ThreadData.id,
            title: ThreadData.title,
            owner: ThreadData.owner,
        }));

        expect(mockThreadRepository.postThread).toBeCalledWith(new PostThread({
            title: ThreadData.title,
            body: ThreadData.body,
        }), ThreadData.owner);
    });
});