export type Emote = {
  _id?: string;
  code: string;
  image: string;
  provider: string;
  providerID: string;
  obsolete: boolean;
  count?: number;
  usedBy?: {
    [key: string]: number;
  };
  usedOn?: {
    [key: string]: number;
  };
};