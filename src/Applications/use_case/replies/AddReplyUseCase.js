const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, threadId, commentId, owner) {
    const addReply = new AddReply(payload);
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(commentId);
    return await this._replyRepository.addReply(addReply, commentId, owner);
  }
}

module.exports = AddReplyUseCase;
