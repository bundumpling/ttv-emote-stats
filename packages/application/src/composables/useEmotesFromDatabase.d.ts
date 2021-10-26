export type DatabaseEmoteState = { 
  error: boolean;
  loading: boolean;
  success: boolean;
  data: Emote[];
};

export interface UseEmotesFromDatabase {
  state: DatabaseEmoteState;
  resetState: () => void;
  requestDatabaseEmotes: (channelName: string) => Promise<void>;
  emotesByCode: ComputedRef<Map<string, Emote>>;
}

export declare function useEmotesFromDatabase(): UseEmotesFromDatabase;