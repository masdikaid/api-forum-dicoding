const AddedReply = require('../../../../Domains/threads/entities/AddedReply');
const ReplyRepository = require('../../../../Domains/threads/ReplyRepository');
const CommentRepository = require('../../../../Domains/threads/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const replyData = {
      id: 'reply-123',
      content: 'dicoding',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const useCasePayload = {
      content: replyData.content,
    };

    const mockAddedReply = new AddedReply({
      id: replyData.id,
      content: replyData.content,
      owner: replyData.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(
      useCasePayload,
      replyData.threadId,
      replyData.commentId,
      replyData.owner,
    );

    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(replyData.threadId);
    expect(mockCommentRepository.verifyComment)
      .toBeCalledWith(replyData.commentId);
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(
        useCasePayload,
        replyData.commentId,
        replyData.owner,
      );

    expect(addedReply)
      .toStrictEqual(new AddedReply({
        id: replyData.id,
        content: replyData.content,
        owner: replyData.owner,
      }));
  });
});
