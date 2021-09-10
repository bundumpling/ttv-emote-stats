// import { InjectionKey } from "@vue/runtime-core";
import { createStore, Store as VuexStore, CommitOptions } from "vuex";
import { Mutations, mutations, MutationType } from "./mutations";
import { IEmote, ILogParserResults } from "../types"

export interface State {
  channel: {
    name: string,
    twitchID: string,
    emotes: Array<IEmote>,
    hasEmotesFrom: {
      'Twitch': boolean,
      'FFZ': boolean,
      'BTTV': boolean,
      '7TV': boolean
    }
  },
  settings: {
    channelEmoteData: {
      channelID?: string,
      emotesFromDatabase: object[],
      emotesFromProviders: object[]
    }
  }
  logParserResults: ILogParserResults,
  logParserFilenames: string[],
  rankings: {
    activeTab: string,
    emoteDetailsModalOpen: boolean,
    searchInput: string
  },
  emoteDetails: any,
  providerAvailability: {
    'Twitch': boolean,
    'FFZ': boolean,
    'BTTV': boolean,
    '7TV': boolean
  },
  emoteFetchButtons: {
    'Twitch': { status: string },
    'FFZ': { status: string },
    'BTTV': { status: string },
    '7TV': { status: string }
  },
  providerAPIResults: {
    'Twitch': Array<any>,
    'FFZ': Array<any>,
    'BTTV': Array<any>,
    '7TV': Array<any>
  },
  emoteGroupingMenuShowAll: boolean,
  emotesPerPage: number
}

export const store = createStore<State>({
  state: {
    channel: {
      name: 'bundumpling',
      twitchID: "472309577",
      emotes: [],
      hasEmotesFrom: {
        'Twitch': false,
        'FFZ': false,
        'BTTV': false,
        '7TV': false
      }
    },
    settings: {
      channelEmoteData: {
        emotesFromDatabase: [],
        emotesFromProviders: []
      }
    },
    logParserResults: {},
    logParserFilenames: [],
    rankings: {
      activeTab: 'Overall',
      emoteDetailsModalOpen: false,
      searchInput: ''
    },
    emoteDetails: {},
    providerAvailability: {
      'Twitch': true,
      'FFZ': true,
      'BTTV': true,
      '7TV': true
    },
    emoteFetchButtons: {
      'Twitch': { status: '' },
      'FFZ': { status: '' },
      'BTTV': { status: '' },
      '7TV': { status: '' }
    },
    providerAPIResults: {
      'Twitch': [],
      'FFZ': [],
      'BTTV': [],
      '7TV': []
    },
    emoteGroupingMenuShowAll: true,
    emotesPerPage: 10
  },
  mutations,
  actions: {
    fetchChannelUsernameAndIDFromTwitch({ dispatch, commit, state }, { username, twitchID }) {
      if (!username && !twitchID) {
        console.error("setChannelNameAndID requires either a username or a twitchID");
        return;
      }
      const paramsString = username ? "login=" + username : "id=" + twitchID;
      const URL = `http://localhost:8081/twitch/users?${paramsString}`;
      const options = {
        method: 'GET'
      };
      fetch(URL, options).then(res => res.json())
        .then(json => {
          if (state.channel.twitchID !== json.id) {
            commit(MutationType.SetChannelNameAndTwitchID, { name: json.login, twitchID: json.id });
          } else {
            throw new Error(`TwitchID is the same as what's currently stored in channel state.`);
          }
        }).then(() => {
          commit(MutationType.ResetEmoteListPagination)
        }).then(() => {
          commit(MutationType.ResetSearchInput)
        }).then(() => {
          commit(MutationType.ResetProviderAvailability)
        }).then(() => {
          commit(MutationType.ResetProviderAPIResults)
        }).then(() => {
          commit(MutationType.ResetEmoteFetchButtons)
        }).then(() => {
          ['Twitch', 'FFZ', 'BTTV', '7TV'].forEach(provider => {
            dispatch('fetchEmotesFromProvider', provider);
          });
        }).catch((error) => {
          console.log(error);
        })

    },
    fetchEmotesFromProvider({ commit, state }, provider: string) {
      commit(MutationType.SetEmoteFetchButtonStatus, { provider, status: 'Loading' })
      type tURLS = {
        [key: string]: string
      }
      const URLS: tURLS = {
        Twitch: `http://localhost:8081/twitch/emotes?id=${state.channel.twitchID}`,
        FFZ: `http://localhost:8081/ffz/emotes?id=${state.channel.twitchID}`,
        BTTV: `http://localhost:8081/bttv/emotes?id=${state.channel.twitchID}`,
        "7TV": `http://localhost:8081/7tv/emotes?name=${state.channel.name}`,
      };

      fetch(URLS[provider], { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            throw new Error(json.error);
          }
          commit(MutationType.SetEmoteFetchButtonStatus, { provider, status: 'Success' })
          commit(MutationType.SetProviderAPIResults, {
            provider,
            emotes: json,
          });
        })
        .catch((error) => {
          console.error(error);
          commit(MutationType.SetEmoteFetchButtonStatus, { provider, status: 'Error' })
          commit(MutationType.SetProviderAvailability, {
            provider,
            isAvailable: false,
          });
        });
    },
    fetchChannelEmoteCounts({ commit }, channelName: string) {
      const URL = `http://localhost:8081/channel/${channelName}/emoteCounts`;
      fetch(URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(({ _id, emotes }) => {
          const twitchID = _id;
          type thasEmotesFrom = {
            [key: string]: boolean
          }
          const hasEmotesFrom = ['Twitch', 'FFZ', 'BTTV', '7TV'].reduce<thasEmotesFrom>((result, provider) => ({
            [provider]: emotes.some((emote: { provider: string; }) => emote.provider === provider),
            ...result
          }), {})

          commit(MutationType.SetChannelData, {
            name: channelName,
            twitchID,
            emotes,
            hasEmotesFrom
          })
        })
        .catch(err => {
          console.error(err);
        })

    },
    fetchEmoteUsedBy({ state, commit }, { emote, emoteListProvider }) {
      const URL = `http://localhost:8081/emote/${emote._id}/usedBy`;
      console.log(URL)
      fetch(URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(usedBy => {
          store.commit(MutationType.OpenEmoteDetailsModal, {
            emote: { usedBy, ...emote },
            fromList: emoteListProvider,
          });
        });
    },
    async getChannelEmotesFromDatabaseAndProviders({ state, commit }, channelName) {
      const URL = `http://localhost:8081/channel/${channelName}/getChannelEmotesFromDatabaseAndProviders`
      fetch(URL, { method: 'GET' })
        .then(response => response.json())
        .then(channelEmoteData => {
          commit(MutationType.SetChannelEmoteData, channelEmoteData)
        })
    },
    saveLogParserResultsToDB({ state, commit }) {
      const channelName = state.channel.name;
      const logFilenames = state.logParserFilenames;
      const logParserResults = state.logParserResults;

      const URL = `http://localhost:8081/channel/${channelName}/updateCountsFromLog`;

      fetch(
        URL,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            logFilenames,
            logParserResults
          })
        }
      ).then(response => response.json()
      ).then(json => {

        commit(MutationType.ResetLogParserResults);
      });
    }
  }
})

export function useStore() {
  return store as Store;
}

export type Store = Omit<VuexStore<any>, "commit"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
};