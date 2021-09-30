<template>
  <li class="emote-list-item" @click="count ? getEmoteDetails() : null">
    <div class="emote-rank">{{ rank }}</div>
    <div class="emote-data">
      <div class="emote-image">
        <img :alt="code" v-bind:src="image" />
      </div>
      <div class="emote-code">
        <span>{{ code }}</span>
      </div>
      <div class="emote-count">
        {{ count }}
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChannelEmoteListItem",
  props: {
    code: String,
    count: Number,
    image: String,
    rank: Number,
    stateIndex: Number,
    usedBy: Object,
    getEmoteDetails: {
      type: Function,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.emote-list-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  height: 24px;
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 0.25em;

  & > * {
    cursor: pointer;
  }
}

.emote-rank {
  align-self: flex-start;
  text-align: center;
  width: 32px;
  line-height: 24px;
  font-weight: bold;
}

.emote-list-item:hover {
  background-color: #ddd;

  .emote-data {
    .emote-code {
      text-overflow: clip;
      white-space: normal;
      word-break: break-all;
      z-index: 2;
      background-color: #ddd;
    }
  }
}

.emote-data {
  display: flex;
  min-width: 12em;
  padding-left: 0.75em;
  justify-content: space-between;
  align-items: baseline;
  align-self: stretch;
}

.emote-image {
  align-self: flex-start;
  width: 24px;
  height: 24px;
  line-height: 24px;
}

.emote-image:hover {
  transform: scale(3);
  z-index: 2;
}

.emote-code {
  max-width: 10em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75em;
  z-index: 1;
  font-family: monospace;
  padding: 0 0.25em;
}

.emote-count {
  align-self: flex-end;
  text-align: right;
  font-family: monospace;
}
</style>