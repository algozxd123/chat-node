import { Document, model, Schema } from 'mongoose';
import { UserType } from '../interfaces/userInterface';

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }],
  friendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }]
}, { timestamps: true });

const userModel = model<UserType & Document>('User', userSchema);

export default userModel;
