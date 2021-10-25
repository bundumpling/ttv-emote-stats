import { ComputedRef } from "vue";
import { UserFromTwitch } from "@ttv-emote-stats/common";

export interface UseTwitchUser {
  hasChannelData: ComputedRef<boolean>;
  channelName: ComputedRef<string | undefined>;
  channelID: ComputedRef<string | undefined>;
  profileImageURL: ComputedRef<string | undefined>;
  requestTwitchUser: (channelName: string) => Promise<void>;
  resetState: () => void;
}

export type TwitchUserState = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: UserFromTwitch | null;
}

export declare function useTwitchUser(): UseTwitchUser;