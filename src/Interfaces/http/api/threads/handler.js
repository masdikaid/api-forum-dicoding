const PostThreadUseCase = require("../../../../Applications/use_case/threads/PostThreadUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const postThreadUseCase = this._container.getInstance(PostThreadUseCase.name);
        const addedThread = await postThreadUseCase.execute(request.payload, request.auth.credentials.id);
        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            }
        });
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;