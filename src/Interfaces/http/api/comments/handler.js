const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');
const LikeToggleCommentUseCase = require('../../../../Applications/use_case/comments/LikeToggleCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.likeCommentToggleHandler = this.likeCommentToggleHandler.bind(this);
  }

  async addCommentHandler(request, h) {
    const { threadId } = request.params;
    const postCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await postCommentUseCase.execute(
      request.payload,
      threadId,
      request.auth.credentials.id,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const {
      threadId,
      commentId,
    } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(threadId, commentId, request.auth.credentials.id);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async likeCommentToggleHandler(request, h) {
    const {
      threadId,
      commentId,
    } = request.params;
    const likeToggleCommentUseCase = this._container.getInstance(LikeToggleCommentUseCase.name);
    await likeToggleCommentUseCase.execute(threadId, commentId, request.auth.credentials.id);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
