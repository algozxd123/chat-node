import { Request, Response } from 'express';
import { FriendRequestType } from '../interfaces/userInterface';
import UserService from '../services/userService';

const getFriendList = async (req: Request, res: Response) => {
  try {
    const friendList = await UserService.getFriendList(req.body.userId);

    return res.status(200).json(friendList);
    
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const getFriendRequestList = async (req: Request, res: Response) => {
  try {
    const friendRequestList = await UserService.getFriendRequestList(req.body.userId);
    return res.status(200).json(friendRequestList);
    
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const friendRequestData: FriendRequestType = req.body;
    await UserService.sendFriendRequest(req.body.userId, friendRequestData.friendId);

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

const UserController = {
  getFriendList,
  getFriendRequestList,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
};

export default UserController;