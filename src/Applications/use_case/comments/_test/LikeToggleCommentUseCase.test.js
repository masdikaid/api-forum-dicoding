const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeToggleCommentUseCase = require('../LikeToggleCommentUseCase');

describe('LikeToggleCommentUseCase', () => {
  const TEST_DATA = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    userId: 'user-123',
  };

  it('should orchestrating the like comment action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentLikedByUser = jest.fn(() => Promise.resolve(false));
    mockCommentRepository.likeComment = jest.fn(() => Promise.resolve());

    const likeToggleCommentUseCase = new LikeToggleCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await likeToggleCommentUseCase
      .execute(TEST_DATA.threadId, TEST_DATA.commentId, TEST_DATA.userId);

    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(TEST_DATA.threadId);
    expect(mockCommentRepository.isCommentLikedByUser)
      .toBeCalledWith(TEST_DATA.commentId, TEST_DATA.userId);
    expect(mockCommentRepository.likeComment)
      .toBeCalledWith(TEST_DATA.commentId, TEST_DATA.userId);
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentLikedByUser = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const likeToggleCommentUseCase = new LikeToggleCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await likeToggleCommentUseCase
      .execute(TEST_DATA.threadId, TEST_DATA.commentId, TEST_DATA.userId);

    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(TEST_DATA.threadId);
    expect(mockCommentRepository.isCommentLikedByUser)
      .toBeCalledWith(TEST_DATA.commentId, TEST_DATA.userId);
    expect(mockCommentRepository.unlikeComment)
      .toBeCalledWith(TEST_DATA.commentId, TEST_DATA.userId);
  });
});
