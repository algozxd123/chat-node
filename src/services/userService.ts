import { UserType } from '../interfaces/userInterface';
import userModel from '../models/userModel';


const getFriendList = async (userId: string): Promise<UserType[]> => {

  const findUser = await userModel.findById(userId);
  if (findUser === null) throw new Error('User doest not exist');

  const friendsList: UserType[] = await userModel.find({ '_id': { '$in': findUser.friends } });

  return friendsList;
};

const getFriendRequestList = async (userId: string): Promise<UserType[]> => {

  const findUser: UserType | null = await userModel.findById(userId);
  if (findUser === null) throw new Error('User doest not exist');

  const friendsList: UserType[] = await userModel.find({ '_id': { '$in': findUser.friendRequests } });

  return friendsList.map((e) => {
    e.password = '';
    return e;
  });
};

const sendFriendRequest = async (userId: string, friendId: string): Promise<void> => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user === friend) throw new Error('You can not send a friend request to yourself.');

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

  if (user === friend) throw new Error('You can not accept a friend request from yourself.');

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

  if (user === friend) throw new Error('You can not refuse a friend request from yourself.');

  if (!user.friendRequests.includes(friendId)) throw new Error('Friend request does not exist');

  user.friendRequests = user.friendRequests.filter((e) => { return e.toString() !== friendId; });
  await user.save();
};

const removeFriend = async (userId: string, friendId: string): Promise<void> => {

  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (user === null) throw new Error('User doest not exist');
  if (friend === null) throw new Error('Friend doest not exist');

  if (user === friend) throw new Error('You can not remove you as a friend.');

  if (!user.friends.includes(friendId)) throw new Error('Friend does not exist');

  user.friends = user.friends.filter((e) => { return e.toString() !== friendId; });
  friend.friends = friend.friends.filter((e) => { return e.toString() !== userId; });
  await user.save();
  await friend.save();
};

const UserService = {
  getFriendList,
  sendFriendRequest,
  getFriendRequestList,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
};

export default UserService;