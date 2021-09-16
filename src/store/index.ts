// import { InjectionKey } from "@vue/runtime-core";
import { createStore, Store as VuexStore, CommitOptions } from "vuex";
import { Mutations, mutations, MutationType } from "./mutations";
import { Emote, ILogParserResults } from "../types"

export interface State {
  channel: {
    name: string,
    twitchID: string,
    emotes: Array<Emote>,
    hasEmotesFrom: {
      'Twitch': boolean,
      'FFZ': boolean,
      'BTTV': boolean,
      '7TV': boolean
    },
    emoteDetails: any,
    emoteDetailsModalOpen: boolean,
    emotesPerPage: number,
    searchInput: string
  },
  settings: {
    channelEmoteData: {
      channelID: string,
      channelName: string,
      emotesFromDatabase: object[],
      emotesFromProviders: object[],
      emoteCodes: string[]
    },
    logParserResults: ILogParserResults,
    logParserFilenames: string[],
  }
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
      },
      emoteDetailsModalOpen: false,
      emoteDetails: {},
      emotesPerPage: 10,
      searchInput: ''
    },
    settings: {
      channelEmoteData: {
        channelName: '',
        channelID: '',
        emotesFromDatabase: [],
        emotesFromProviders: [],
        emoteCodes: []
      },
      logParserResults: {},
      logParserFilenames: [],
    },
  },
  mutations,
  actions: {
    fetchChannelEmoteCounts({ state, commit }, channelName: string) {
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
            ...state.channel,
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
    getChannelEmoteCodes({ state, commit }, channelName) {
      const URL = `http://localhost:8081/channel/${channelName}/emoteCodes`;
      fetch(URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(({ channelID, emoteCodes }) => {
          commit(MutationType.SetChannelEmoteData, {
            channelID,
            channelName,
            emoteCodes
          });
        })
    },
    fetchEmoteUsedBy({ state, commit }, { emote, emoteListProvider }) {
      const URL = `http://localhost:8081/emote/${emote._id}/usedBy`;
      fetch(URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(usedBy => {
          commit(MutationType.OpenEmoteDetailsModal, {
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
    saveUpdatedEmotesToDB({ state, commit }, { channelName, channelID, emotes }) {

      const URL = `http://localhost:8081/channel/${channelName}/saveUpdatedEmotes`;

      fetch(
        URL,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            channelID,
            emotes
          })
        }
      ).then(response => response.json()
      ).then(json => {
        // post save redirect?
        if (json.ok) {
          console.log(json);
        }
      })
    },
    saveLogParserResultsToDB({ state, commit }) {
      const channelName = state.channel.name;
      const logFilenames = state.settings.logParserFilenames;
      const logParserResults = state.settings.logParserResults;

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