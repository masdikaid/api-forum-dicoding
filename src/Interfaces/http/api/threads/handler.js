const PostThreadUseCase = require("../../../../Applications/use_case/threads/PostThreadUseCase");
const AddCommentUseCase = require("../../../../Applications/use_case/threads/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/threads/DeleteCommentUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/threads/DetailThreadUseCase");
const AddReplyUseCase = require("../../../../Applications/use_case/threads/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/threads/DeleteReplyUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.addCommentHandler = this.addCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
        this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
        this.addReplyHandler = this.addReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
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

    async getThreadDetailHandler(request, h) {
        const {threadId} = request.params;
        const getDetailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const detailThread = await getDetailThreadUseCase.execute(threadId);
        const response = h.response({
            status: 'success',
            data: {
                thread: detailThread,
            }
        });
        response.code(200);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const {threadId, commentId} = request.params;
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute(threadId, commentId, request.auth.credentials.id);
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }

    async addReplyHandler(request, h) {
        const {threadId, commentId} = request.params;
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const addedReply = await addReplyUseCase.execute(request.payload, threadId, commentId, request.auth.credentials.id);
        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            }
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        const {threadId, commentId, replyId} = request.params;
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        await deleteReplyUseCase.execute(threadId, commentId, replyId, request.auth.credentials.id);
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadsHandler;