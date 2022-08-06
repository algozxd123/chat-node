import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { FriendRequestType, SendFriendRequestType, UserType } from '../interfaces/userInterface';
import UserService from '../services/userService';

const getFriendList = async (req: Request, res: Response) => {
  try {
    const friendList = await UserService.getFriendList(req.body.userId);

    return res.status(200).json({ data: friendList, message: 'Friend request list retrieved'});
    
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const getFriendRequestList = async (req: Request, res: Response) => {
  try {
    const friendRequestList = await UserService.getFriendRequestList(req.body.userId);
    return res.status(200).json({ data: friendRequestList, message: 'Friend request list retrieved'});
    
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const friendRequestData: SendFriendRequestType = req.body;
    await UserService.sendFriendRequest(req.body.userId, friendRequestData.username);

    return res.status(200).json({ message: 'Friend request sent' });

  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const friendRequestData: FriendRequestType = req.body;
    await UserService.acceptFriendRequest(req.body.userId, friendRequestData.friendId);

    return res.status(200).json({ message: 'Friend request accepted' });

  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const friendRequestData: FriendRequestType = req.body;
    await UserService.rejectFriendRequest(req.body.userId, friendRequestData.friendId);

    return res.status(200).json({ message: 'Friend request rejected' });

  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const removeFriend = async (req: Request, res: Response) => {
  try {
    const friendRequestData: FriendRequestType = req.body;
    await UserService.removeFriend(req.body.userId, friendRequestData.friendId);

    return res.status(200).json({ message: 'Friend request sent' });

  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const userData: UserType = await UserService.getUser(req.body.userId);
    return res.status(200).json({ data: userData, message: 'User retrieved'});
    
  } catch(error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const sendMessage = async (io: Server, socket: Socket, text: string, userId: string, friendId: string) => {
  try {
    const message = await UserService.createMessage(text, userId, friendId);

    let room: string;
    if(userId>=friendId) room = `${userId}-${friendId}`;
    else room = `${friendId}-${userId}`;

    io.to(room).emit('message_sent', {message: 'message sent', data: message});
  } catch(error) {
    socket.emit('error', {error: 'message failed'});
  }
};

const getMessages = async (req: Request, res: Response) => {
  const friendData: FriendRequestType = req.body;
  const messages = await UserService.getMessages(req.body.userId, friendData.friendId);

  return res.status(200).json({ data: messages, messages: 'Messages retrieved' });
};

const UserController = {
  getFriendList,
  getFriendRequestList,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getUser,
  sendMessage,
  getMessages
};

export default UserController;