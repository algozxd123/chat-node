import supertest from 'supertest';
import { fail } from 'assert';
import { app } from '../server';

export let authToken: string;
export let userId: string;

const userData = {
  email: 'authUser1@gmail.com',
  username: 'authUser1',
  password: '12345678'
};

describe('Authentication system', () => {
  it('register should return complete user', async () => {
    const response = await supertest(app)
      .post('/api/signup')
      .send(userData)
      .set('Content-Type', 'application/json');

    if (response.body.error) fail(response.body.error);

    expect(response.body.user.username).toBe(userData.username);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.friends).toEqual([]);
    expect(response.body.user.friendRequests).toEqual([]);
    expect(response.body.user).toHaveProperty('password');
    expect(response.body.user).toHaveProperty('_id');
    expect(response.body.user).toHaveProperty('createdAt');
    expect(response.body.user).toHaveProperty('updatedAt');
  });

  it('login should return complete user', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({email: userData.email, password: userData.password})
      .set('Content-Type', 'application/json');

    if (response.body.error) fail(response.body.error);

    authToken = response.body.jwt.token;
    userId = response.body.user._id;

    expect(response.body.user.username).toBe(userData.username);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.friends).toEqual([]);
    expect(response.body.user.friendRequests).toEqual([]);
    expect(response.body.user).toHaveProperty('_id');
    expect(response.body.user).toHaveProperty('createdAt');
    expect(response.body.user).toHaveProperty('updatedAt');
    expect(response.body.jwt).toHaveProperty('token');
    expect(response.body.jwt).toHaveProperty('expiresIn');
  });
});