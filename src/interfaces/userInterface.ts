import { z } from 'zod';

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

type UserType = z.infer<typeof UserValidator>;
type FriendRequestType = z.infer<typeof FriendRequestValidator>;

export { UserType, UserValidator, FriendRequestType, FriendRequestValidator };