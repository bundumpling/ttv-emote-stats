import { Document } from 'mongodb';
export interface ChannelDocument extends Omit<Document, '_id'> {
  _id: string;
  emotes: string[];
  parsedLogfiles: string[];
  profileImageURL: string;
}