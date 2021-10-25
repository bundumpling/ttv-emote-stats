export type DatabaseEmoteState = { 
  error: boolean;
  loading: boolean;
  success: boolean;
  data: Emote[];
};

export interface UseEmotesFromDatabase {
  state: DatabaseEmoteState;
  resetState: () => void;
  requestDatabaseEmotes: (channelName: string) => void;
}

export declare function useEmotesFromDatabase(): UseEmotesFromDatabase;