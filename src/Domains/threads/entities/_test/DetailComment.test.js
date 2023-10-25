const DetailComment = require("../DetailComment");
describe('a DetailComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'thread-123',
            content: 'abc',
        };

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'thread-123',
            content: 123,
            date: 123,
            username: 123,
            owner: 123,
        };

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailComment object correctly', () => {
        const payload = {
            id: 'thread-123',
            content: 'abc',
            date: new Date(),
            username: 'abc',
            owner: 'user-123',
        };

        const {id, content, date, username, owner} = new DetailComment(payload);

        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(owner).toEqual(payload.owner);
    });
});