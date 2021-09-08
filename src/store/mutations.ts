import { MutationTree } from "vuex";
import { IEmote, ILogParserResults } from '../types';

export enum MutationType {
  SetChannelNameAndTwitchID = "SET_CHANNEL_NAME_AND_TWITCHID",
  ResetEmoteListPagination = "RESET_EMOTELIST_PAGINATION",
  ResetSearchInput = "RESET_SEARCH_INPUT",
  ResetProviderAvailability = "RESET_PROVIDER_AVAILABILITY",
  ResetProviderAPIResults = "RESET_PROVIDER_API_RESULTS",
  ResetEmoteFetchButtons = "RESET_EMOTE_FETCH_BUTTONS",
  SetActiveTab = "SET_ACTIVE_TAB",
  OpenEmoteDetailsModal = "OPEN_EMOTE_DETAILS_MODAL",
  CloseEmoteDetailsModal = "CLOSE_EMOTE_DETAILS_MODAL",
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
  SaveLogParserResults = "SAVE_LOG_PARSER_RESULTS",
  SetChannelData = "SET_CHANNEL_DATA",
  UpdateLogParserResults = "UPDATE_LOG_PARSER_RESULTS",
  ResetLogParserResults = "RESET_LOG_PARSER_RESULTS"
}

export type Mutations = {
  [MutationType.SetChannelNameAndTwitchID](state: any, params: { name: string, twitchID: string }): void;
  [MutationType.ResetEmoteListPagination](state: any): void;
  [MutationType.ResetSearchInput](state: any): void;
  [MutationType.ResetProviderAvailability](state: any): void;
  [MutationType.ResetProviderAPIResults](state: any): void;
  [MutationType.ResetEmoteFetchButtons](state: any): void;
  [MutationType.SetActiveTab](state: any, tabName: string): void;
  [MutationType.OpenEmoteDetailsModal](state: any, emote: any): void;
  [MutationType.CloseEmoteDetailsModal](state: any): void;
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
  [MutationType.SaveLogParserResults](state: any, resultsMap: any): void;
  [MutationType.SetChannelData](state: any, channelData: any): void;
  [MutationType.UpdateLogParserResults](state: any, results: any): void;
  [MutationType.ResetLogParserResults](state: any): void;
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
    if (tabName) { state.rankings.activeTab = tabName }
  },
  [MutationType.OpenEmoteDetailsModal](state, { emote, fromList }) {
    state.channel.emotes[emote.stateIndex].usedBy = emote.usedBy;
    state.emoteDetails = { fromList, ...emote };
    state.rankings.emoteDetailsModalOpen = true;
  },
  [MutationType.CloseEmoteDetailsModal](state) {
    state.rankings.emoteDetailsModalOpen = false;
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
  [MutationType.SetEmotesPerPage](state, emotesPerPage: number) {
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
    fetch(
      `http://localhost:8081/channel/${state.channel.name}/update`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelID: state.channel.twitchID,
          emotes: emotes
        })
      }
    ).then(response => response.status)
  },
  [MutationType.RandomizeCounts](state) {
    state.channel.emotes = state.channel.emotes.map((e: IEmote) => {
      e.count = Math.floor(Math.random() * 10000)
      return e;
    })
  },
  [MutationType.ZeroCounts](state) {
    state.channel.emotes = state.channel.emotes.map((e: IEmote) => {
      e.count = 0;
      e.usedBy = {};
      return e
    })
  },
  [MutationType.SaveLogParserResults](state, resultsMap) {
    resultsMap.forEach((v: any) => {
      if (v) {
        state.channel.emotes[v.index].count += v.count;
        // eslint-disable-next-line
        for (let user in v.usedBy) {
          if (state.channel.emotes[v.index].usedBy[user] === undefined) {
            state.channel.emotes[v.index].usedBy[user] = v.usedBy[user];
          } else {
            state.channel.emotes[v.index].usedBy[user] += v.usedBy[user];
          }
        }
      }
    })
  },
  [MutationType.SetChannelData](state, channelData) {
    state.channel = channelData;
  },
  [MutationType.UpdateLogParserResults](state, { logFilename, logParserResult }) {
    if (!Object.keys(state.logParserResults).length) {
      state.logParserResults = logParserResult;
    } else {
      const { usernameLastSeen, emoteCounts } = logParserResult;
      Object.keys(emoteCounts).forEach((key) => {
        const value = emoteCounts[key];
        if (value.count && value.usedBy) {
          if (state.logParserResults.emoteCounts[key]) {
            state.logParserResults.emoteCounts[key].count += value.count;
            Object.keys(value.usedBy).forEach(username => {
              if (value.usedBy) {
                if (state.logParserResults.emoteCounts[key].usedBy[username]) {
                  state.logParserResults.emoteCounts[key].usedBy[username] += value.usedBy[username];
                } else {
                  state.logParserResults.emoteCounts[key].usedBy[username] = value.usedBy[username];
                }
              }
            })
          } else {
            state.logParserResults.emoteCounts[key] = value;
          }
        }
      })
      Object.keys(usernameLastSeen).forEach((username) => {
        const timestamp = usernameLastSeen[username];
        if (timestamp) {
          if (state.logParserResults.usernameLastSeen[username]) {
            state.logParserResults.usernameLastSeen[username] = Math.max(state.logParserResults.usernameLastSeen[username], timestamp)
          } else {
            state.logParserResults.usernameLastSeen[username] = timestamp;
          }
        }
      })
    }
    state.logParserFilenames = [logFilename, ...state.logParserFilenames];
  },
  [MutationType.ResetLogParserResults](state) {
    state.logParserResults = {};
    state.logParserFilenames = [];
  }
}
