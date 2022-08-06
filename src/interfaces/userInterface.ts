import { z } from 'zod';
import { Schema } from 'mongoose';

const UserValidator = z.object({
  _id: z.string(),
  username: z.string().min(4).max(8),
  email: z.string().email(),
  password: z.string().min(8),
  friends: z.array(z.string()),
  friendRequests: z.array(z.string())
});

const FriendRequestValidator = z.object({
  friendId: z.string()
});

const SendFriendRequestValidator = z.object({
  username: z.string()
});

const MessageValidator = z.object({
  text: z.string(),
  senderId: z.instanceof(Schema.Types.ObjectId),
  receiverId: z.instanceof(Schema.Types.ObjectId),
  createdAt: z.string()
});

type UserType = z.infer<typeof UserValidator>;
type FriendRequestType = z.infer<typeof FriendRequestValidator>;
type SendFriendRequestType = z.infer<typeof SendFriendRequestValidator>;
type MessageType = z.infer<typeof MessageValidator>;

export { UserType, UserValidator, FriendRequestType, FriendRequestValidator, SendFriendRequestType, SendFriendRequestValidator, MessageType, MessageValidator };