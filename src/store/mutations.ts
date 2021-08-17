import { MutationTree } from "vuex";

export enum MutationType {
  SetChannelNameAndTwitchID = "SET_CHANNEL_NAME_AND_TWITCHID",
  ResetEmoteListPagination = "RESET_EMOTELIST_PAGINATION",
  ResetSearchInput = "RESET_SEARCH_INPUT",
  ResetProviderAvailability = "RESET_PROVIDER_AVAILABILITY",
  ResetProviderAPIResults = "RESET_PROVIDER_API_RESULTS",
  ResetEmoteFetchButtons = "RESET_EMOTE_FETCH_BUTTONS",
  SetActiveTab = "SET_ACTIVE_TAB",
  SetSearchInput = "SET_SEARCH_INPUT",
  SetProviderAvailability = "SET_PROVIDER_AVAILABILITY",
  SetEmoteFetchButtonStatus = "SET_EMOTE_FETCH_BUTTON_STATUS",
  SetProviderAPIResults = "SET_PROVIDER_API_RESULTS",
  SetEmotesPerPage = "SET_EMOTES_PER_PAGE",
  NextPage = "NEXT_PAGE",
  PrevPage = "PREV_PAGE",
  UpdateEmotes = "UPDATE_EMOTES",
  RandomizeCounts = "RANDOMIZE_COUNTS",
  ZeroCounts = "ZERO_COUNTS",
  ParseLog = "PARSE_LOG"
}

export type Mutations = {
  [MutationType.SetChannelNameAndTwitchID](state: any, params: { name: string, twitchID: string }): void;
  [MutationType.ResetEmoteListPagination](state: any): void;
  [MutationType.ResetSearchInput](state: any): void;
  [MutationType.ResetProviderAvailability](state: any): void;
  [MutationType.ResetProviderAPIResults](state: any): void;
  [MutationType.ResetEmoteFetchButtons](state: any): void;
  [MutationType.SetActiveTab](state: any, tabName: string): void;
  [MutationType.SetSearchInput](state: any, value: string): void;
  [MutationType.SetProviderAvailability](state: any, params: { provider: string, isAvailable: boolean }): void;
  [MutationType.SetEmoteFetchButtonStatus](state: any, params: { provider: string, status: string }): void;
  [MutationType.SetProviderAPIResults](state: any, params: { provider: string, emotes: Array<any> }): void;
  [MutationType.SetEmotesPerPage](state: any, emotesPerPage: number): void;
  [MutationType.NextPage](state: any, emoteListProvider: string): void;
  [MutationType.PrevPage](state: any, emoteListProvider: string): void;
  [MutationType.UpdateEmotes](state: any, emotes: Array<any>): void;
  [MutationType.RandomizeCounts](state: any): void;
  [MutationType.ZeroCounts](state: any): void;
  [MutationType.ParseLog](state: any, log: any): void;
}

export const mutations: MutationTree<any> & Mutations = {
  [MutationType.SetChannelNameAndTwitchID](state, { name, twitchID }) {
    state.channel = {
      name,
      twitchID,
      emotes: [], // reset emotes
      hasEmotesFrom: {
        'Twitch': false,
        'FFZ': false,
        'BTTV': false,
        '7TV': false
      }
    }
  },
  [MutationType.ResetEmoteListPagination](state) {
    for (const provider in state.emoteListPageNumbers) {
      state.emoteListPageNumbers[provider] = 0;
    }
  },
  [MutationType.ResetSearchInput](state) {
    state.rankings.searchInput = '';
  },
  [MutationType.ResetProviderAvailability](state) {
    for (const provider in state.providerAvailability) {
      state.providerAvailability[provider] = true;
    }
  },
  [MutationType.ResetProviderAPIResults](state) {
    for (const provider in state.providerAPIResults) {
      state.providerAPIResults[provider] = [];
    }
  },
  [MutationType.ResetEmoteFetchButtons](state) {
    for (const provider in state.emoteFetchButtons) {
      state.emoteFetchButtons[provider] = { status: '' };
    }
  },
  [MutationType.SetActiveTab](state, tabName) {
    state.rankings.activeTab = tabName;
  },
  [MutationType.SetSearchInput](state, value) {
    state.rankings.searchInput = value;
  },
  [MutationType.SetProviderAvailability](state, { provider, isAvailable }) {
    state.providerAvailability[provider] = isAvailable;
  },
  [MutationType.SetEmoteFetchButtonStatus](state, { provider, status }) {
    state.emoteFetchButtons[provider].status = status;
  },
  [MutationType.SetProviderAPIResults](state, { provider, emotes }) {
    state.providerAPIResults[provider] = emotes;
  },
  [MutationType.SetEmotesPerPage](state, emotesPerPage) {
    state.emotesPerPage = Number(emotesPerPage);
    for (const emoteListProvider in state.emoteListPageNumbers) {
      state.emoteListPageNumbers[emoteListProvider] = 0;
    }
  },
  [MutationType.NextPage](state, emoteListProvider) {
    state.emoteListPageNumbers[emoteListProvider]++;
  },
  [MutationType.PrevPage](state, emoteListProvider) {
    state.emoteListPageNumbers[emoteListProvider]--;
  },
  [MutationType.UpdateEmotes](state, emotes) {
    state.channel.emotes = emotes;
    for (const provider in state.channel.hasEmotesFrom) {
      state.channel.hasEmotesFrom[provider] = emotes.find(emote => emote.provider === provider) ? true : false;
    }
  },
  [MutationType.RandomizeCounts](state) {
    state.channel.emotes = state.channel.emotes.map(e => {
      e.count = Math.floor(Math.random() * 10000)
      return e;
    })
  },
  [MutationType.ZeroCounts](state) {
    state.channel.emotes = state.channel.emotes.map(e => {
      e.count = 0;
      return e
    })
  },
  [MutationType.ParseLog](state, log) {
    const resultsMap = new Map<any, any>(state.channel.emotes.map((e, i) => [e.name, { index: i, count: 0 }]));
    let cursor = 0;
    let word = "";
    while (cursor < log.length) {
      if (/\s/.test(log[cursor])) {
        if (resultsMap.has(word)) {
          const mapEntry = resultsMap.get(word);
          mapEntry.count++;
          resultsMap.set(word, resultsMap.get(word))
        }
        word = "";
      } else {
        word += log[cursor];
      }
      cursor++;
    }
    resultsMap.forEach((v) => {
      if (v) {
        state.channel.emotes[v.index].count += v.count;
      }
    })
  }
}
