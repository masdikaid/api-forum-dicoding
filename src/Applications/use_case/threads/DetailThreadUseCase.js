class DetailThreadUseCase {
    constructor({commentRepository, threadRepository}) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        await this._threadRepository.verifyThread(threadId);
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(threadId);
        return {...thread, comments};
    }
}

module.exports = DetailThreadUseCase;