const AddedComment = require('../../../../Domains/threads/entities/AddedComment');
const CommentRepository = require('../../../../Domains/threads/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const commentData = {
      id: 'comment-123',
      content: 'dicoding',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const useCasePayload = {
      content: commentData.content,
    };

    const mockAddedComment = new AddedComment({
      id: commentData.id,
      content: commentData.content,
      owner: commentData.owner,
    });

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      commentData.threadId,
      commentData.owner,
    );

    expect(mockCommentRepository.addComment)
      .toBeCalledWith(
        useCasePayload,
        commentData.threadId,
        commentData.owner,
      );

    expect(addedComment)
      .toStrictEqual(new AddedComment({
        id: commentData.id,
        content: commentData.content,
        owner: commentData.owner,
      }));
  });
});
