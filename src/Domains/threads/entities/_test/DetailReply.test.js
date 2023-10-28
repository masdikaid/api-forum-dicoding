const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'abc',
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 123,
      date: 123,
      username: 123,
      owner: 123,
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'abc',
      date: new Date(),
      username: 'abc',
    };

    const {
      id, content, date, username,
    } = new DetailReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  it('should change content to be "**balasan telah dihapus**" when deleted_at is not null', () => {
    const payload = {
      id: 'reply-123',
      content: 'abc',
      date: new Date(),
      username: 'abc',
      deleted_at: new Date(),
    };

    const { content } = new DetailReply(payload);

    expect(content).toEqual('**balasan telah dihapus**');
  });
});
