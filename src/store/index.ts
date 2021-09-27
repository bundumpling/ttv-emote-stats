// import { InjectionKey } from "@vue/runtime-core";
import { createStore, Store as VuexStore, CommitOptions } from "vuex";
import { Mutations, mutations, MutationType } from "./mutations";
import { Emote, LogParserResults } from "../types"

export interface State {
  settings: {
    channelEmoteData: {
      channelID: string,
      channelName: string,
      emotesFromDatabase: object[],
      emotesFromProviders: object[],
      emoteCodes: string[]
    }
  }
}

export const store = createStore<State>({
  state: {
    settings: {
      channelEmoteData: {
        channelName: '',
        channelID: '',
        emotesFromDatabase: [],
        emotesFromProviders: [],
        emoteCodes: []
      }
    }
  },
  mutations,
  actions: {
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
          // console.log(json);
        }
      })
    },
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