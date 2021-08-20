export interface IEmote {
  id: string,
  name: string,
  provider: string,
  image: string,
  count: number,
  usedBy?: object
}

export interface IEmoteInList extends IEmote {
  rank: number
}

export interface IEmoteFromTwitchAPI {
  id: string,
  name: string,
  images: {
    url_1x: string,
    url_2x: string,
    url_3x: string
  },
  tier: string,
  emote_type: string,
  emote_set_id: string,
  format: string[],
  scale: string[],
  theme_mode: string[],
}

export interface IEmoteFromFFZAPI {
  id: number,
  name: string,
  height: number,
  width: number,
  public: boolean,
  hidden: boolean,
  modifier: boolean,
  offset: any,
  margine: any,
  css: any,
  owner: {
    _id: number,
    name: string,
    display_name: string
  },
  urls: {
    1: string,
    2?: string,
    4?: string
  },
  status: number,
  usage_count: number,
  created_at: string,
  last_updated: string
}

export interface IEmoteFromBTTVAPI {
  id: string,
  code: string,
  imageType: string,
  userId?: string,
  user?: {
    id: string,
    name: string,
    displayName: string,
    providerId: string
  }
}

export interface IEmoteFrom7TVAPI {
  id: string,
  name: string,
  ownder: {
    id: string,
    twitch_id: string,
    login: string,
    display_name: string,
    role: {
      id: string,
      name: string,
      position: number,
      color: number,
      allowed: number,
      denied: number,
      default: boolean
    },
    visibility: number,
    visibility_simple: number[],
    mime: string,
    status: number,
    tags: string[],
    width: number[],
    height: number[],
    urls: [string[]]
  }
}

export enum ParserStatus {
  IDLE = "IDLE",
  PARSING = "PARSING",
  SAVING = "SAVING",
  DONE = "DONE",
}

export type tLogParserProgressData = {
  filenames: string[];
  activeIndex: number | null;
  numParsed: number;
  status: ParserStatus;
  errors: string[];
  reset: () => void;
};