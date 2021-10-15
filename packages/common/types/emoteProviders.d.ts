export interface EmoteFromFFZ {
  id: number;
  name: string;
  height: number;
  width: number;
  public: boolean;
  hidden: boolean;
  modifier: boolean;
  offset?: string | null;
  margins?: string | null;
  css?: string | null;
  owner?: {
    _id: number;
    name: string;
    display_name?: string | null;
  };
  urls: {
    1: string;
    2?: string;
    4?: string;
  };
  animated?: {
    1: string | null;
    2?: string;
    4?: string;
  }
  status?: number;
  usage_count?: number;
  created_at?: string;
  last_updated?: string;
}

export interface ResponseFromFFZ {
  room: {
    _id: number;
    twitch_id: number;
    youtube_id?: string | null;
    id: string;
    is_group?: boolean;
    display_name?: string;
    set: number;
    moderator_badge?: string | null;
    vip_badge?: {
      1: string; 
      2?: string | null;
      4?: string | null
    };
    mod_urls?: {
      1: string;
      2?: string | null;
      4?: string | null
    };
    user_badges?: {};
    user_badge_ids?: {};
    css?: string | null
  };
  sets: {
    [key: string]: {
      id: number;
      _type: number;
      icon?: string | null;
      title?: string | null;
      description?: string | null;
      css?: string | null;
      emoticons: EmoteFromFFZ[];
    }
  }
}

export interface EmoteFromBTTV {
  id: string;
  code: string;
  imageType: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    displayName: string;
    providerId: string;
  };
}

export interface ResponseFromBTTV {
  id: string;
  bots?: any[];
  avatar?: string;
  channelEmotes: {
    id: string;
    code: string;
    imageType: sting;
    userId: string;
  }[];
  sharedEmotes: {
    id: string;
    code: string;
    imageType: string;
    user: {
      id: string;
      name: string;
      displayName?: string;
      providerId: string;
    }
  }[];
}

export interface EmoteFrom7TV {
  id: string;
  name: string;
  owner?: {
    id: string;
    twitch_id: string;
    login: string;
    display_name?: string;
    role?: {
      id: string;
      name: string;
      position: number;
      color: number;
      allowed: number;
      denied: number;
      default: boolean;
    };
    visibility: number;
    visibility_simple: number[];
    mime: string;
    status: number;
    tags: string[];
    width: number[];
    height: number[];
    urls: string[][];
  };
}

export interface ResponseFrom7TV extends Array<EmoteFrom7TV> {}

export interface EmoteFromTwitch {
  id: string;
  name: string;
  images: {
    url_1x: string;
    url_2x: string;
    url_3x: string;
  };
  tier: string;
  emote_type: string;
  emote_set_id: string;
  format: string[];
  scale: string[];
  theme_mode: string[];
}

export interface ResponseFromTwitchForEmotes {
  data: EmoteFromTwitch[];
  template: string;
} 

export interface UserFromTwitch {
  id: string,
  login: string;
  display_name: string;
  type: "staff" | "admin" | "global_mod" | "";
  broadcaster_type: "partner" | "affiliate" | "";
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

export interface ResponseFromTwitchForUsers {
  data: UserFromTwitch[];
}

export declare function combineBTTVChannelEmotesAndSharedEmotesFromAPIResponse(response: ResponseFromBTTV): EmoteFromBTTV[];
