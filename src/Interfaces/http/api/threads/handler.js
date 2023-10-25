const PostThreadUseCase = require("../../../../Applications/use_case/threads/PostThreadUseCase");
const AddCommentUseCase = require("../../../../Applications/use_case/threads/AddCommentUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.addCommentHandler = this.addCommentHandler.bind(this);
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

    async addCommentHandler(request, h) {
        const {threadId} = request.params;
        const postCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await postCommentUseCase.execute(request.payload, threadId, request.auth.credentials.id);
        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            }
        });
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;