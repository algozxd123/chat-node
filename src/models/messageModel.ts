import { model, Schema } from 'mongoose';
import { MessageType } from '../interfaces/userInterface';

const messageSchema: Schema = new Schema<MessageType>({
  text: {
    type: String,
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
}, {
  timestamps: true
});

const messageModel = model<MessageType>('Message', messageSchema);

export default messageModel;
