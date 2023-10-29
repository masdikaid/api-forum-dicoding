const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, threadId, owner) {
    await this._threadRepository.verifyThread(threadId);
    const addComment = new AddComment(payload);
    return await this._commentRepository.addComment(addComment, threadId, owner);
  }
}

module.exports = AddCommentUseCase;
