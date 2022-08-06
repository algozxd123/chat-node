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

    if (response.body.error) fail(response.body.data.error);

    expect(response.body.message).toBe('User created');
    fail();
  });

  it('login should return complete user', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({email: userData.email, password: userData.password})
      .set('Content-Type', 'application/json');

    if (response.body.error) fail(response.body.data.error);

    authToken = response.body.data.jwt.token;
    userId = response.body.data.user._id;

    expect(response.body.data.user.username).toBe(userData.username);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.user).toHaveProperty('_id');
    expect(response.body.data.jwt).toHaveProperty('token');
    expect(response.body.data.jwt).toHaveProperty('expiresIn');
    expect(response.body.message).toBe('Login successful');
  });
});