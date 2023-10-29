const PostThreadUseCase = require('../../../../Applications/use_case/threads/PostThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/threads/DetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const postThreadUseCase = this._container.getInstance(PostThreadUseCase.name);
    const addedThread = await postThreadUseCase.execute(
      request.payload,
      request.auth.credentials.id,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const { threadId } = request.params;
    const getDetailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const detailThread = await getDetailThreadUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread: detailThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
