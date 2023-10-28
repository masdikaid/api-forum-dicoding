const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'abc',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: 123,
      date: 123,
      username: 123,
      owner: 123,
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'abc',
      date: new Date(),
      username: 'abc',
    };

    const {
      id, content, date, username,
    } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  it('should change content to be "**komentar telah dihapus**" when deleted_at is not null', () => {
    const payload = {
      id: 'comment-123',
      content: 'abc',
      date: new Date(),
      username: 'abc',
      deleted_at: new Date(),
    };

    const { content } = new DetailComment(payload);

    expect(content).toEqual('**komentar telah dihapus**');
  });
});
