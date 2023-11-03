class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentWithReplies = await Promise.all(comments.map(async (comment) => {
      const likeCount = await this._commentRepository.getCommentLikesCount(comment.id);
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      return {
        ...comment,
        replies,
        likeCount,
      };
    }));

    return {
      ...thread,
      comments: commentWithReplies,
    };
  }
}

module.exports = DetailThreadUseCase;
