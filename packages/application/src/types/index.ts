/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ISearchInput {
  name: string;
  getInput: () => string;
  setInput: (value: string) => void;
  validationRegExp: RegExp;
  reset: () => void;
  lockable: Boolean;
  isLocked?: () => boolean;
  toggleLock?: () => void | undefined;
}

type EmoteDetails = Emote & {
  stateIndex: number;
  fromList: string;
  rank: number;
};

export interface ChannelState {
  name: string;
  twitchID: string | null;
  emotes: Array<Emote>;
  hasEmotesFrom: { [index: string]: boolean };
  emoteDetails: EmoteDetails;
  loadingEmoteDetails: boolean;
  emoteDetailsModalOpen: boolean;
  emotesPerPage: number;
  emoteSearchInput: string;
  userSearchInput: string;
  userSearchLocked: boolean;
  toggleUserSearchLock: Function;
  openEmoteDetailsModal: Function;
  closeEmoteDetailsModal: Function;
  setEmoteSearchInput: Function;
  setUserSearchInput: Function;
  setEmotesPerPage: Function;
}

export interface ParseLogsState {
  channelID: string;
  emoteCodes: Array<string>;
  logParserResults: LogParserResults;
  logParserFilenames: Array<string>;
  progressData: LogParserProgressData;
}

export interface UpdateEmotesState {
  channelID: string | null;
  emotesFromDatabase: Emote[];
  emotesFromProviders: EmoteFromProvider[];
  emoteCodes: string[];
}

export interface LogParserResults {
  emoteCounts: LogParserEmoteCounts;
  usernameLastSeen: {
    [key: string]: number;
  };
}

export interface LogParserResult {
  emoteCounts: LogParserEmoteCounts;
  usernameLastSeen: {
    [key: string]: number;
  };
  logDate: number | null;
}

export interface LogParserEmoteCounts {
  [key: string]: {
    count: number;
    usedBy: {
      [key: string]: number;
    };
    usedOn: {
      [key: number]: number;
    };
  };
}

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

export type EmoteFromList = Emote & {
  stateIndex: number;
  rank: number;
};

export type EmoteForUpdate = Emote & {
  isNew?: boolean;
  isUnavailable?: boolean;
  isUpdated?: boolean;
};

export type EmoteInList = Emote & {
  rank: number;
};

export interface IEmoteFromTwitchAPI {
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

export interface IEmoteFromFFZAPI {
  id: number;
  name: string;
  height: number;
  width: number;
  public: boolean;
  hidden: boolean;
  modifier: boolean;
  offset: any;
  margine: any;
  css: any;
  owner: {
    _id: number;
    name: string;
    display_name: string;
  };
  urls: {
    1: string;
    2?: string;
    4?: string;
  };
  status: number;
  usage_count: number;
  created_at: string;
  last_updated: string;
}

export interface IEmoteFromBTTVAPI {
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

export interface IEmoteFrom7TVAPI {
  id: string;
  name: string;
  ownder: {
    id: string;
    twitch_id: string;
    login: string;
    display_name: string;
    role: {
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
    urls: [string[]];
  };
}

export const enum ParserStatus {
  IDLE = "IDLE",
  LOADING = "LOADING",
  PARSING = "PARSING",
  SAVING = "SAVING",
  ERROR = "ERROR",
  DONE = "DONE",
}

export type LogParserProgressData = {
  uploadedList: string[];
  parsedList: string[];
  skippedList: string[];
  errorList: string[];
  status: ParserStatus;
  statusMsg: string;
};

export type EmoteFromProvider = {
  code: string;
  image: string;
  provider: string;
  providerID: string;
};

export * from "@/composables/useTwitchUser.d";
export * from "@/composables/useEmotesFromProviders.d";
export * from "@/composables/useEmotesFromDatabase.d";