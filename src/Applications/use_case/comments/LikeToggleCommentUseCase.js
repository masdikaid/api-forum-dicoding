class LikeToggleCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(commentId);
    const isLiked = await this._commentRepository.isCommentLikedByUser(commentId, owner);

    if (isLiked) {
      await this._commentRepository.unlikeComment(commentId, owner);
    } else {
      await this._commentRepository.likeComment(commentId, owner);
    }
  }
}

module.exports = LikeToggleCommentUseCase;
