class PostThreadUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(payload, owner) {
        return await this._threadRepository
            .postThread(payload, owner);
    }
}

module.exports = PostThreadUseCase;