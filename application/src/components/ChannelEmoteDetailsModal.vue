<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="image is-32x32">
          <img :src="image" :alt="code" />
        </div>
        <p class="modal-card-title ml-3">Details for {{ code }}</p>
        <span class="close" aria-label="close" @click="close()"
          ><font-awesome-icon icon="window-close"
        /></span>
      </header>
      <section class="modal-card-body">
        <div class="subheader">
          <span class="rank">#{{ rank }}</span> in
          {{ fromList }} Emotes
        </div>
        <div>
          <p class="subheader-usedinchannel">
            Used <span class="count">{{ count }}</span> times in
            <span class="channel">{{ channelName }}</span
            >'s channel.
          </p>
          <p class="subheader-mostusedby">
            Most used by
            <span class="username">{{ mostUsedBy[0].username }}</span> a total
            of <span class="count">{{ mostUsedBy[0].count }}</span> times!
          </p>
          <p class="subheader-mostusedon">
            Most used on <span class="date">{{ mostUsedOn.date }}</span> a total of <span class="count">{{ mostUsedOn.count }}</span> times!
          </p>
        </div>
      </section>
      <section class="modal-card-body mostusedby-wrapper">
        <div class="search-input-wrapper">
          <font-awesome-icon class="search-input-lock" :icon="searchInputLocked ? 'lock' : 'lock-open'" @click="toggleSearchInputLock" />
          <label>Search Users: </label>
          <input
            name="userSearch"
            v-model="userSearch"
            class="input"
            type="text"
            aria-label="search input"
            autocomplete="off"
            @keydown.space.prevent
          />
          <span class="search-input-reset" @click="resetSearchInput">Ｘ</span>
        </div>
        <div class="mostusedby-header">
          <span
            class="pagePrevious"
            :class="hasPrevPage ? 'is-clickable' : 'hidden'"
            @click="hasPrevPage ? prevPage() : null"
          >
            <font-awesome-icon icon="chevron-left" />
          </span>
          <h2>Top Users</h2>
          <span
            class="pageNext"
            :class="hasNextPage ? 'is-clickable' : 'hidden'"
            @click="hasNextPage ? nextPage() : null"
          >
            <font-awesome-icon icon="chevron-right" />
          </span>
        </div>
        <div v-if="userSearchInput.length && !mostUsedByFiltered.length" class="mostusedby-noresults">
          No Results
        </div>
        <ol v-else class="mostusedby" type="none">
          <li
            v-for="(user) in (userSearchInput.length ? mostUsedByFiltered : mostUsedBy).slice(page * 10, (page + 1) * 10)"
            :key="user.username"
            :class="
              page === 0 && user.rank < 3
                ? ['gold', 'silver', 'bronze'][user.rank]
                : ['lightgray', ''][user.rank % 2]
            "
          >
            <div class="mostusedby-rank-and-username">
              <span class="mostusedby-rank">{{ page * 10 + user.rank + 1 }}</span>
              <span class="mostusedby-username">{{ user.username }}</span>
            </div>
            <span class="mostusedby-count">{{ user.count }}</span>
          </li>
        </ol>
      </section>
      <footer class="modal-card-foot" />
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelState } from "../types";
import { defineComponent, inject, computed, ref } from "vue";

export default defineComponent({
  name: "ChannelEmoteDetailsModal",
  props: {},
  setup() {
    const state = inject('state') as ChannelState;

    const page = ref(0);
    const userSearchInput = computed(() => state.userSearchInput)
    const searchInputLocked = computed(() => state.userSearchLock)

    const mostUsedOn = computed(() => {
      let result = { date: '', count: 0 };
      for (const dateKey in state.emoteDetails.usedOn) {
        const count = state.emoteDetails.usedOn[dateKey]
        if (count > result.count) {
          const year = Number(String(dateKey).slice(0, 4));
          const month = Number(String(dateKey).slice(4, 6)) - 1;
          const day = Number(String(dateKey).slice(6));
          const date = new Date(year, month, day);
          const dateString = date.toDateString();

          result = { date: dateString, count }
        }
      }
      return result;
    })

    const mostUsedBy = computed(() => {
      let result = [];
      for (const user in state.emoteDetails.usedBy) {
        const username = user.split("-")[0];
        const count = state.emoteDetails.usedBy[user]
        result.push({ username, count });
      }
      return result
        .sort((a, b) => b.count - a.count)
        .map((user, rank) => ({ rank, ...user }));
    });

    const mostUsedByFiltered = computed(() => {
      return mostUsedBy.value.filter(({ username }) => {
        return username.includes(userSearchInput.value);
      })
    })

    const hasPrevPage = computed(() => page.value > 0);
    const hasNextPage = computed(
      () => (page.value + 1) * 10 < (userSearchInput.value.length ? mostUsedByFiltered.value.length : mostUsedBy.value.length)
    );

    function prevPage() {
      page.value--;
    }
    function nextPage() {
      page.value++;
    }
    const userSearch = computed({
      get: () => state.userSearchInput,
      set(value) {
        state.setUserSearchInput(value);
        page.value = 0;
      },
    });

    return {
      code: state.emoteDetails.code,
      count: state.emoteDetails.count,
      rank: state.emoteDetails.rank,
      image: state.emoteDetails.image,
      fromList: state.emoteDetails.fromList,
      channelName: state.name,
      userSearch,
      userSearchInput,
      searchInputLocked,
      mostUsedOn,
      mostUsedBy,
      mostUsedByFiltered,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      toggleSearchInputLock: () => state.toggleUserSearchLock(),
      resetSearchInput: () => state.setUserSearchInput(''),
      close: () => state.closeEmoteDetailsModal(),
    };
  },
});
</script>

<style lang="scss" scoped>
.close {
  font-size: 2em;
  color: maroon;
  cursor: pointer;
}

.subheader {
  text-align: center;
  font-size: 1.3em;
  .rank {
    font-size: 1.5em;
    font-weight: bold;
    font-family: monospace;
    color: black;
  }
}

.subheader-usedinchannel {
  text-align: center;
  font-size: 1.2em;

  .count {
    font-size: 1.3em;
    font-weight: bold;
    font-family: monospace;
    color: black;
  }
  .channel {
    font-size: 1.3em;
    font-variant: small-caps;
    color: #111;
  }
}

.subheader-mostusedby,
.subheader-mostusedon {
  text-align: center;
  font-size: 1.1em;

  .username, 
  .count {
    font-size: 1.2em;
    font-family: monospace;
    color: black;
    font-weight: bold;
  }

  .date {
    font-size: 1em;
    font-weight: bold;
    color: black;
  }
}

.rankings {
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  font-variant: small-caps;
}

.mostusedby-noresults {
  min-height: 238px;
  text-align: center;
  color: maroon;
  font-size: 1.5em;
  font-variant: small-caps;
}

.mostusedby {
  min-height: 238px;
  width: 50%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  li {
    display: flex;
    justify-content: space-between;
    font-family: monospace;
  }
}

.mostusedby-rank-and-username {
  display: flex;
  justify-content: space-between;
}

.mostusedby-rank {
  font-size: 1em;
  min-width: 1.5em;
  text-align: right;
  margin-right: 0.5em;
  font-weight: bold;
  color: black;
}

.mostusedby-username {
  color: black;
}

.mostusedby-count {
  color: black;
}

.mostusedby-header {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
  margin: 0 auto;
  margin-bottom: 0.5em;

  h2 {
    font-weight: bold;
    font-size: 1.1em;
    font-variant: small-caps;
    user-select: none;
  }
}

.hidden {
  visibility: hidden;
}

.gold,
.silver,
.bronze {
  font-weight: bold;
}

.gold {
  background-color: #af9500;
}
.silver {
  background-color: #d7d7d7;
}
.bronze {
  background-color: #ad8a56;
}
.lightgray {
  background-color: #eee;
}

.search-input-wrapper {
  margin: 0 auto;
  padding-bottom: 1em;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: baseline;

  label {
    padding-right: 0.5em;
    white-space: nowrap;
  }
  input {
    height: 1.5em;
  }

  .search-input-lock {
    text-align: center;
    min-width: 24px;
    cursor: pointer;
  }

  .search-input-reset {
    padding-left: 4px;
    font-weight: bold;
    color: maroon;
    cursor: pointer;
  }
}
</style>