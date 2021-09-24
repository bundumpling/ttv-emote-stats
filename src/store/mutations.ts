import { MutationTree } from "vuex";

export enum MutationType {
  SetChannelNameAndTwitchID = "SET_CHANNEL_NAME_AND_TWITCHID",
  OpenEmoteDetailsModal = "OPEN_EMOTE_DETAILS_MODAL",
  CloseEmoteDetailsModal = "CLOSE_EMOTE_DETAILS_MODAL",
  SetEmoteSearchInput = "SET_EMOTE_SEARCH_INPUT",
  ResetEmoteSearchInput = "RESET_EMOTE_SEARCH_INPUT",
  SetUserSearchInput = "SET_USER_SEARCH_INPUT",
  ResetUserSearchInput = "RESET_USER_SEARCH_INPUT",
  ToggleUserSearchLock = "TOGGLE_USER_SEARCH_LOCK",
  SetEmotesPerPage = "SET_EMOTES_PER_PAGE",
  UpdateEmotes = "UPDATE_EMOTES",
  SaveLogParserResults = "SAVE_LOG_PARSER_RESULTS",
  SetChannelData = "SET_CHANNEL_DATA",
  UpdateLogParserResults = "UPDATE_LOG_PARSER_RESULTS",
  ResetLogParserResults = "RESET_LOG_PARSER_RESULTS",
  SetChannelEmoteData = "SET_CHANNEL_EMOTE_DATA",
  SetEmoteData = "SET_EMOTE_DATA"
}

export type Mutations = {
  [MutationType.SetChannelNameAndTwitchID](state: any, params: { name: string, twitchID: string }): void;
  [MutationType.OpenEmoteDetailsModal](state: any, emote: any): void;
  [MutationType.CloseEmoteDetailsModal](state: any): void;
  [MutationType.SetEmoteSearchInput](state: any, value: string): void;
  [MutationType.ResetEmoteSearchInput](state: any): void;
  [MutationType.SetUserSearchInput](state: any, value: string): void;
  [MutationType.ResetUserSearchInput](state: any): void;
  [MutationType.ToggleUserSearchLock](state: any): void;
  [MutationType.SetEmotesPerPage](state: any, emotesPerPage: number): void;
  [MutationType.UpdateEmotes](state: any, emotes: Array<any>): void;
  [MutationType.SaveLogParserResults](state: any, resultsMap: any): void;
  [MutationType.SetChannelData](state: any, channelData: any): void;
  [MutationType.UpdateLogParserResults](state: any, results: any): void;
  [MutationType.ResetLogParserResults](state: any): void;
  [MutationType.SetChannelEmoteData](state: any, results: any): void;
  [MutationType.SetEmoteData](state: any, emote: any): void;
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
  [MutationType.OpenEmoteDetailsModal](state, { emote, fromList }) {
    state.channel.emotes[emote.stateIndex].usedBy = emote.usedBy;
    state.channel.emotes[emote.stateIndex].usedOn = emote.usedOn;
    state.channel.emoteDetails = { fromList, rank: emote.rank, stateIndex: emote.stateIndex };
    state.channel.emoteDetailsModalOpen = true;
  },
  [MutationType.CloseEmoteDetailsModal](state) {
    state.channel.emoteDetailsModalOpen = false;
    if (!state.channel.userSearchLock) {
      state.channel.userSearchInput = '';
    }
  },
  [MutationType.SetEmoteSearchInput](state, value) {
    state.channel.emoteSearchInput = value;
  },
  [MutationType.ResetEmoteSearchInput](state) {
    state.channel.emoteSearchInput = '';
  },
  [MutationType.SetUserSearchInput](state, value) {
    state.channel.userSearchInput = value;
  },
  [MutationType.ResetUserSearchInput](state) {
    state.channel.userSearchInput = '';
  },
  [MutationType.ToggleUserSearchLock](state) {
    state.channel.userSearchLock = !state.channel.userSearchLock;
  },
  [MutationType.SetEmotesPerPage](state, emotesPerPage: number) {
    state.channel.emotesPerPage = Number(emotesPerPage);
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
    if (!Object.keys(state.settings.logParserResults).length) {
      state.settings.logParserResults = logParserResult;
    } else {
      const { logDate, usernameLastSeen, emoteCounts } = logParserResult;
      Object.keys(emoteCounts).forEach((key) => {
        const value = emoteCounts[key];
        if (value.count && value.usedBy) {
          if (state.settings.logParserResults.emoteCounts[key]) {
            state.settings.logParserResults.emoteCounts[key].count += value.count;
            if (state.settings.logParserResults.emoteCounts[key].usedOn[logDate]) {
              state.settings.logParserResults.emoteCounts[key].usedOn[logDate] += value.count;
            } else {
              state.settings.logParserResults.emoteCounts[key].usedOn[logDate] = value.count;
            }
            Object.keys(value.usedBy).forEach(username => {
              if (value.usedBy) {
                if (state.settings.logParserResults.emoteCounts[key].usedBy[username]) {
                  state.settings.logParserResults.emoteCounts[key].usedBy[username] += value.usedBy[username];
                } else {
                  state.settings.logParserResults.emoteCounts[key].usedBy[username] = value.usedBy[username];
                }
              }
            })
          } else {
            value.usedOn[logDate] = value.count;
            state.settings.logParserResults.emoteCounts[key] = value;
          }
        }
      })
      Object.keys(usernameLastSeen).forEach((username) => {
        const timestamp = usernameLastSeen[username];
        if (timestamp) {
          if (state.settings.logParserResults.usernameLastSeen[username]) {
            state.settings.logParserResults.usernameLastSeen[username] = Math.max(state.settings.logParserResults.usernameLastSeen[username], timestamp)
          } else {
            state.settings.logParserResults.usernameLastSeen[username] = timestamp;
          }
        }
      })
    }
    state.settings.logParserFilenames = [logFilename, ...state.settings.logParserFilenames];
  },
  [MutationType.ResetLogParserResults](state) {
    state.settings.logParserResults = {};
    state.settings.logParserFilenames = [];
  },
  [MutationType.SetChannelEmoteData](state, channelEmoteData) {
    state.settings.channelEmoteData = channelEmoteData;
  },
  [MutationType.SetEmoteData](state, emote) {
    state.emote = emote;
  }
}
