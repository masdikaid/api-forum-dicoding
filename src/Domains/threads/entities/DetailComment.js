class DetailComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const {id, content, date, username, owner} = payload;

        this.id = id;
        this.content = content;
        this.date = date;
        this.username = username;
        this.owner = owner;
    }

    _verifyPayload({id, content, date, username, owner}) {
        if (!id || !content || !date || !username || !owner) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'object' || typeof username !== 'string' || typeof owner !== 'string') {
            throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailComment;
