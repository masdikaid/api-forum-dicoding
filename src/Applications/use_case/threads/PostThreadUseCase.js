const PostThread = require('../../../Domains/threads/entities/PostThread');

class PostThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload, owner) {
    const postThread = new PostThread(payload);
    return await this._threadRepository
      .postThread(postThread, owner);
  }
}

module.exports = PostThreadUseCase;
