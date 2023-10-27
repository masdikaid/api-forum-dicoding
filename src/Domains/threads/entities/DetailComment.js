class DetailComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const {id, content, date, username, deleted_at} = payload;

        this.id = id;
        this.date = date;
        this.username = username;
        this.content = deleted_at ? "**komentar telah dihapus**" : content;
    }

    _verifyPayload({id, content, date, username}) {
        if (!id || !content || !date || !username) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'object' || typeof username !== 'string') {
            throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailComment;
