const AddedReply = require("../AddedReply");
describe('a AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'reply-123',
            content: 'abc',
        };

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'reply-123',
            content: 123,
            owner: 123,
        };

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedReply object correctly', () => {
        const payload = {
            id: 'reply-123',
            content: 'abc',
            owner: 'user-123',
        };

        const {id, content, owner} = new AddedReply(payload);

        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});