const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Post = require('../src/models/Post');

let token;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/humanity-social-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteMany();
  await Post.deleteMany();
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test2@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Post API', () => {
  let postId;

  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello world!', socialAccounts: [], type: 'text' });
    expect(res.statusCode).toBe(201);
    expect(res.body.post.content).toBe('Hello world!');
    postId = res.body.post._id;
  });

  it('should get all posts', async () => {
    const res = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it('should update a post', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Updated content' });
    expect(res.statusCode).toBe(200);
    expect(res.body.post.content).toBe('Updated content');
  });

  it('should delete a post', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});
