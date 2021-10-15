import { Document } from 'mongodb';
export interface ChannelDocument extends Document {
  _id: string;
  emotes: string[];
  parsedLogfiles: string[];
  profileImageURL: string;
}