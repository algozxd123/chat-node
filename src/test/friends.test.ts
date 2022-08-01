import supertest from 'supertest';
import { app } from '../server';
import UserService from '../services/userService';
import { createUser } from './setup';
import { UserTokenType } from '../interfaces/authInterface';
import { fail } from 'assert';

let userWithToken1: UserTokenType;
let userWithToken2: UserTokenType;

beforeAll(async () => {
  userWithToken1 = await createUser({
    email: 'userfriend1@gmail.com',
    username: 'userfriend1',
    password: '12345678'
  });

  userWithToken2 = await createUser({
    email: 'userfriend2@gmail.com',
    username: 'userfriend2',
    password: '12345678'
  });
});

describe('Friend system', () => {
  it('should send friend request', async () => {
    const bodyData = {
      friendId: userWithToken2.user._id.toString()
    };

    const response = await supertest(app)
      .post('/api/sendFriendRequest')
      .send(bodyData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userWithToken1.jwt.token}`);

    if (response.body.error) fail(response.body.error);

    const friendRequestList = await UserService.getFriendRequestList(userWithToken2.user._id.toString());
    expect(response.body.message).toBe('Friend request sent');
    expect(friendRequestList.length).toBe(1);
    expect(friendRequestList[0]._id.toString()).toBe(userWithToken1.user._id.toString());
  });

  it('should list friend requests', async () => {
    const response = await supertest(app)
      .get('/api/getFriendRequestsList')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userWithToken2.jwt.token}`);

    if (response.body.error) fail(response.body.error);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]._id.toString()).toBe(userWithToken1.user._id.toString());
    expect(response.body[0].username).toBe(userWithToken1.user.username);
    expect(response.body[0].email).toBe(userWithToken1.user.email);
  });

  it('should reject friend request', async () => {

    const bodyData = {
      friendId: userWithToken1.user._id.toString()
    };

    const response = await supertest(app)
      .post('/api/rejectFriendRequest')
      .send(bodyData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userWithToken2.jwt.token}`);

    if (response.body.error) fail(response.body.error);

    const friendRequestList = await UserService.getFriendRequestList(userWithToken2.user._id.toString());
    expect(response.body.message).toBe('Friend request rejected');
    expect(friendRequestList.length).toBe(0);
  });

  it('should accept friend request', async () => {
    const bodyData = {
      friendId: userWithToken1.user._id.toString()
    };

    await UserService.sendFriendRequest(userWithToken1.user._id.toString(), userWithToken2.user._id.toString());

    const response = await supertest(app)
      .post('/api/acceptFriendRequest')
      .send(bodyData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userWithToken2.jwt.token}`);

    if (response.body.error) fail(response.body.error);

    const friendRequestList = await UserService.getFriendRequestList(userWithToken2.user._id.toString());
    const friendList1 = await UserService.getFriendList(userWithToken1.user._id.toString());
    const friendList2 = await UserService.getFriendList(userWithToken2.user._id.toString());
    expect(response.body.message).toBe('Friend request accepted');
    expect(friendRequestList.length).toBe(0);
    expect(friendList1.length).toBe(1);
    expect(friendList2.length).toBe(1);
    expect(friendList1[0]._id.toString()).toBe(userWithToken2.user._id.toString());
    expect(friendList2[0]._id.toString()).toBe(userWithToken1.user._id.toString());
  });

  it('should list friends', async () => {
    const response = await supertest(app)
      .get('/api/getFriendList')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userWithToken2.jwt.token}`);

      if (response.body.error) fail(response.body.error);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]._id.toString()).toBe(userWithToken1.user._id.toString());
      expect(response.body[0].username).toBe(userWithToken1.user.username);
      expect(response.body[0].email).toBe(userWithToken1.user.email);
  });

  it('should remove friend', async () => {
    const bodyData = {
      friendId: userWithToken1.user._id.toString()
    };

    const response = await supertest(app)
      .post('/api/removeFriend')
      .send(bodyData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userWithToken2.jwt.token}`);

    if (response.body.error) fail(response.body.error);

    const friendList1 = await UserService.getFriendList(userWithToken1.user._id.toString());
    const friendList2 = await UserService.getFriendList(userWithToken2.user._id.toString());
    expect(friendList1.length).toBe(0);
    expect(friendList2.length).toBe(0);
  });
});