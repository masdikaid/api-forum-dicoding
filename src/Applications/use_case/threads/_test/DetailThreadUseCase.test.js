const DetailThread = require("../../../../Domains/threads/entities/DetailThread");
const DetailComment = require("../../../../Domains/threads/entities/DetailComment");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../../Domains/threads/CommentRepository");
const DetailThreadUseCase = require("../DetailThreadUseCase");
describe('DetailThreadUseCase', () => {
    const TEST_DATA = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
        username: 'dicoding',
        title: 'dicoding thread',
        body: 'ini isi thread',
        content: 'ini isi komentar',
        date: new Date(),
    }

    const detailThread = new DetailThread({
        id: TEST_DATA.threadId,
        title: TEST_DATA.title,
        body: TEST_DATA.body,
        date: TEST_DATA.date,
        username: TEST_DATA.username,
    })

    const detailComment = [new DetailComment({
        id: TEST_DATA.commentId,
        username: TEST_DATA.username,
        date: TEST_DATA.date,
        content: TEST_DATA.content,
    })]

    it('should orchestrating the detail thread action correctly', async () => {
        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(detailThread));
        mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(detailComment));

        const getDetailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        const detailThreadUseCase = await getDetailThreadUseCase.execute(TEST_DATA.threadId);
        expect(detailThreadUseCase).toStrictEqual({...detailThread, comments: detailComment});
        expect(mockThreadRepository.verifyThread).toBeCalledWith(TEST_DATA.threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(TEST_DATA.threadId);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(TEST_DATA.threadId);
    });
});