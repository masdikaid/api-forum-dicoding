const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(
      useCasePayload.threadId,
      useCasePayload.commentId,
      useCasePayload.replyId,
      useCasePayload.owner,
    );
    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(
        useCasePayload.replyId,
        useCasePayload.owner,
      );
    expect(mockReplyRepository.deleteReply)
      .toBeCalledWith(useCasePayload.replyId);
  });
});
