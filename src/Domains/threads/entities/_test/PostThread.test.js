const PostThread = require("../PostThread");
describe('a PostThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'abc',
        };

        expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title: 123,
            body: true,
        };

        expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when title contains more than 50 character', () => {
        const payload = {
            title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
            body: 'Dicoding Indonesia',
        };

        expect(() => new PostThread(payload)).toThrowError('POST_THREAD.TITLE_LIMIT_CHAR');
    });

    it('should create postThread object correctly', () => {
        const payload = {
            title: 'dicoding',
            body: 'Dicoding Indonesia',
        };

        const {title, body} = new PostThread(payload);

        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});