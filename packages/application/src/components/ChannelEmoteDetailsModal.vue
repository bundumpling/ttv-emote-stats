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
          <span class="rank">#{{ rank }}</span> in {{ fromList }} Emotes
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
            Most used on <span class="date">{{ mostUsedOn.date }}</span> a total
            of <span class="count">{{ mostUsedOn.count }}</span> times!
          </p>
        </div>
      </section>
      <section class="modal-card-body mostusedby-wrapper">
        <UsedByList
          :most-used-by="mostUsedBy"
          :user-search-input="userSearchInput"
        />
      </section>
      <footer class="modal-card-foot" />
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelState } from "../types";
import { defineComponent, inject, computed } from "vue";
import UsedByList from "./EmoteUsedByList.vue";

export default defineComponent({
  name: "ChannelEmoteDetailsModal",
  components: {
    UsedByList,
  },
  props: {},
  setup() {
    const state = inject("state") as ChannelState;

    const mostUsedOn = computed(() => {
      let result = { date: "", count: 0 };
      for (const dateKey in state.emoteDetails.usedOn) {
        const count = state.emoteDetails.usedOn[dateKey];
        if (count > result.count) {
          const year = Number(String(dateKey).slice(0, 4));
          const month = Number(String(dateKey).slice(4, 6)) - 1;
          const day = Number(String(dateKey).slice(6));
          const date = new Date(year, month, day);
          const dateString = date.toDateString();

          result = { date: dateString, count };
        }
      }
      return result;
    });

    const mostUsedBy = computed(() => {
      let result = [];
      for (const user in state.emoteDetails.usedBy) {
        const username = user.split("-")[0];
        const count = state.emoteDetails.usedBy[user];
        result.push({ username, count });
      }
      return result
        .sort((a, b) => b.count - a.count)
        .map((user, rank) => ({ rank, ...user }));
    });

    const userSearchInput = computed(() => state.userSearchInput);

    return {
      code: state.emoteDetails.code,
      count: state.emoteDetails.count,
      rank: state.emoteDetails.rank,
      image: state.emoteDetails.image,
      fromList: state.emoteDetails.fromList,
      mostUsedBy,
      usedOn: state.emoteDetails.usedOn,
      channelName: state.name,
      userSearchInput,
      mostUsedOn,
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

.subheader-mostusedon,
.subheader-mostusedby {
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
</style>
