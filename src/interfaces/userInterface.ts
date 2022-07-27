import { z } from 'zod';

const UserValidator = z.object({
  _id: z.string(),
  username: z.string().min(4).max(8),
  email: z.string().email(),
  password: z.string().min(8),
  friends: z.array(z.string()),
  friendRequests: z.array(z.string())
});

type UserType = z.infer<typeof UserValidator>;

export { UserType, UserValidator };