import { MessageType, UserType } from '../interfaces/userInterface';
import messageModel from '../models/messageModel';
import userModel from '../models/userModel';


const getFriendList = async (userId: string): Promise<UserType[]> => {

  const findUser = await userModel.findById(userId);
  if (findUser === null) throw new Error('User doest not exist');

  const friendsList: UserType[] = await userModel.find({ '_id': { '$in': findUser.friends } }).select('_id username email');

  return friendsList;
};

const getFriendRequestList = async (userId: string): Promise<UserType[]> => {

  const findUser: UserType | null = await userModel.findById(userId);
  if (findUser === null) throw new Error('User doest not exist');

  const friendsList: UserType[] = await userModel.find({ '_id': { '$in': findUser.friendRequests } }).select('_id username email');

  return friendsList;
};

const sendFriendRequest = async (userId: string, username: string): Promise<void> => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findOne({ username: username });

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user._id === friend._id) throw new Error('You can not send a friend request to yourself.');

  if (friend.friendRequests.includes(userId)) throw new Error('Friend request was already sent');
  if(friend.friends.includes(userId)) throw new Error('User already is your friend');

  friend.friendRequests.push(userId);
  await friend.save();
};

const acceptFriendRequest = async (userId: string, friendId: string): Promise<void> => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user._id === friend._id) throw new Error('You can not accept a friend request from yourself.');

  if (!user.friendRequests.includes(friendId)) throw new Error('Friend request does not exist');

  user.friendRequests = user.friendRequests.filter((e) => { return e.toString() !== friendId; });
  
  // If both had friend requests to each other
  friend.friendRequests = friend.friendRequests.filter((e) => { return e.toString() !== userId; });

  user.friends.push(friendId);
  friend.friends.push(userId);
  await friend.save();
  await user.save();
};

const rejectFriendRequest = async (userId: string, friendId: string): Promise<void> => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user._id === friend._id) throw new Error('You can not refuse a friend request from yourself.');

  if (!user.friendRequests.includes(friendId)) throw new Error('Friend request does not exist');

  user.friendRequests = user.friendRequests.filter((e) => { return e.toString() !== friendId; });
  await user.save();
};

const removeFriend = async (userId: string, friendId: string): Promise<void> => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user._id === friend._id) throw new Error('You can not remove you as a friend.');

  if (!user.friends.includes(friendId)) throw new Error('Friend does not exist');

  user.friends = user.friends.filter((e) => { return e.toString() !== friendId; });
  friend.friends = friend.friends.filter((e) => { return e.toString() !== userId; });
  await user.save();
  await friend.save();
};

const getUser = async (userId: string) => {
  
  const user: UserType | null = await userModel.findById(userId).select('_id username email');
  if (user === null) throw new Error('User doest not exist');

  return user;
};

const createMessage = async (text: string, userId:string, friendId:string) => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user._id === friend._id) throw new Error('You can not message yourself.');

  if (!user.friends.includes(friend._id)) throw new Error('You can not message a non friend');

  const result = await messageModel.create({text, senderId: userId, receiverId: friend._id});

  const message: MessageType = {
    text: result.text,
    senderId: result.senderId,
    receiverId: result.receiverId,
    createdAt: result.createdAt
  };

  return message;
};

const getMessages = async (userId: string, friendId:string) => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user._id === friend._id) throw new Error('You can retrieve messages with yourself.');

  if (!user.friends.includes(friend._id)) throw new Error('You can not retrieve messages with a non friend');

  const messages: MessageType[] = await messageModel.find({$or: [{senderId: userId, receiverId: friendId},{senderId: friendId, receiverId: userId}]}).select('senderId receiverId createdAt text');

  return messages;
};

const UserService = {
  getFriendList,
  sendFriendRequest,
  getFriendRequestList,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getUser,
  createMessage,
  getMessages
};

export default UserService;