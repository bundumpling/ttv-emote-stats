import { InjectionKey } from "@vue/runtime-core";
import { createStore, Store, MutationTree, ActionTree } from "vuex";

export interface State {
  channel: {
    name: string,
    twitchID: string,
    emotes: Array<any>,
    hasEmotesFrom: {
      'Twitch': boolean,
      'FFZ': boolean,
      'BTTV': boolean,
      '7TV': boolean
    }
  },
  rankings: {
    activeTab: string,
    searchInput: string
  },
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
  emoteListPageNumbers: {
    "Overall": number,
    "Twitch": number,
    "FFZ": number,
    "BTTV": number,
    "7TV": number
  },
  emotesPerPage: number
}

export const key: InjectionKey<Store<State>> = Symbol();

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
    rankings: {
      activeTab: 'Overall',
      searchInput: ''
    },
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
    emoteListPageNumbers: {
      "Overall": 0,
      "Twitch": 0,
      "FFZ": 0,
      "BTTV": 0,
      "7TV": 0
    },
    emotesPerPage: 10
  },
  mutations: <MutationTree<State>>{
    setChannelNameAndTwitchID(state, { name, twitchID }) {
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
    resetEmoteListPagination(state: any) {
      for (const provider in state.emoteListPageNumbers) {
        state.emoteListPageNumbers[provider] = 0;
      }
    },
    resetSearchInput(state) {
      state.rankings.searchInput = '';
    },
    resetProviderAvailability(state: any) {
      for (const provider in state.providerAvailability) {
        state.providerAvailability[provider] = true;
      }
    },
    resetProviderAPIResults(state: any) {
      for (const provider in state.providerAPIResults) {
        state.providerAPIResults[provider] = [];
      }
    },
    resetEmoteFetchButtons(state: any) {
      for (const provider in state.emoteFetchButtons) {
        state.emoteFetchButtons[provider] = { status: '' };
      }
    },
    setActiveTab(state, tabName) {
      state.rankings.activeTab = tabName;
    },
    setSearchInput(state, value) {
      state.rankings.searchInput = value;
    },
    setProviderAvailability(state: any, { provider, isAvailable }) {
      state.providerAvailability[provider] = isAvailable;
    },
    setEmoteFetchButtonStatus(state: any, { provider, status }) {
      state.emoteFetchButtons[provider].status = status;
    },
    setProviderAPIResults(state: any, { provider, emotes }) {
      state.providerAPIResults[provider] = emotes;
    },
    setEmoteGroupingMenuShowAll(state, showAll) {
      state.emoteGroupingMenuShowAll = showAll
    },
    setEmotesPerPage(state: any, emotesPerPage) {
      state.emotesPerPage = Number(emotesPerPage);
      for (const emoteListProvider in state.emoteListPageNumbers) {
        state.emoteListPageNumbers[emoteListProvider] = 0;
      }
    },
    nextPage(state: any, emoteListProvider) {
      state.emoteListPageNumbers[emoteListProvider]++;
    },
    prevPage(state: any, emoteListProvider) {
      state.emoteListPageNumbers[emoteListProvider]--;
    },
    updateEmotes(state: any, emotes) {
      state.channel.emotes = emotes;
      for (const provider in state.channel.hasEmotesFrom) {
        state.channel.hasEmotesFrom[provider] = emotes.find(emote => emote.provider === provider) ? true : false;
      }
    },
    randomizeCounts(state) {
      state.channel.emotes = state.channel.emotes.map(e => {
        e.count = Math.floor(Math.random() * 10000)
        return e;
      })
    },
    zeroCounts(state) {
      state.channel.emotes = state.channel.emotes.map(e => {
        e.count = 0;
        return e
      })
    },
    parseLog(state, log) {
      const resultsMap = new Map(state.channel.emotes.map((e, i) => [e.name, { index: i, count: 0 }]));
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
  },
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
            commit('setChannelNameAndTwitchID', { name: json.login, twitchID: json.id });
          } else {
            throw new Error(`TwitchID is the same as what's currently stored in channel state.`);
          }
        }).then(() => {
          commit('resetEmoteListPagination')
        }).then(() => {
          commit('resetSearchInput')
        }).then(() => {
          commit('resetProviderAvailability')
        }).then(() => {
          commit('resetProviderAPIResults')
        }).then(() => {
          commit('resetEmoteFetchButtons')
        }).then(() => {
          ['Twitch', 'FFZ', 'BTTV', '7TV'].forEach(provider => {
            dispatch('fetchEmotesFromProvider', provider);
          });
        }).catch((error) => {
          console.log(error);
        })

    },
    fetchEmotesFromProvider({ commit, state }, provider) {
      commit('setEmoteFetchButtonStatus', { provider, status: 'Loading' })
      const URLS = {
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
          commit('setEmoteFetchButtonStatus', { provider, status: 'Success' })
          commit("setProviderAPIResults", {
            provider,
            emotes: json,
          });
        })
        .catch((error) => {
          console.error(error);
          commit('setEmoteFetchButtonStatus', { provider, status: 'Error' })
          commit("setProviderAvailability", {
            provider,
            isAvailable: false,
          });
        });
    },
  }
})