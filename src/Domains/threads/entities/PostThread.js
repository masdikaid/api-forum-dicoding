class PostThread {
    constructor(payload) {
        this._verifyPayload(payload);

        const {title, body} = payload;

        this.title = title;
        this.body = body;
    }

    _verifyPayload({title, body, owner}) {
        if (!title || !body) {
            throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (title.length > 50) {
            throw new Error('POST_THREAD.TITLE_LIMIT_CHAR');
        }
    }
}

module.exports = PostThread;