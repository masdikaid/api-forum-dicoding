const ReplyRepository = require("../../../../Domains/threads/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");
const CommentRepository = require("../../../../Domains/threads/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
describe('DeleteReplyUseCase', () => {
    it('should orchestrating the delete reply action correctly', async () => {
        const useCasePayload = {
            replyId: 'reply-123',
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThread = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.verifyReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
        });

        await deleteReplyUseCase.execute(useCasePayload.threadId, useCasePayload.commentId, useCasePayload.replyId, useCasePayload.owner);
        expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyComment).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    });
});