<template>
  <li
    :class="
      'emote-list-item ' +
      (rangeStart <= index && index <= rangeEnd
        ? ''
        : 'emote-list-item--hidden')
    "
  >
    <div class="emote-data">
      <div class="emote-image">
        <img :alt="emote.name" v-bind:src="emote.image" />
      </div>
      <div class="emote-name">
        <span>{{ emote.name }}</span>
      </div>
      <div class="emote-count">
        {{ emote.count }}
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "EmoteListItem",
  props: {
    emote: {
      name: String,
      count: Number,
      image: String,
    },
    index: Number,
    rangeStart: Number,
    rangeEnd: Number,
  },
};
</script>

<style lang="scss" scoped>
.emote-list-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  height: 24px;
  font-size: 24px;
  counter-increment: count;
  line-height: 24px;
  margin-bottom: 0.25em;
}

.emote-list-item:before {
  content: counter(count);
  text-align: center;
  width: 32px;
  line-height: 24px;
  font-weight: bold;
}

.emote-list-item--hidden {
  visibility: hidden;
  max-height: 0px;
  margin-bottom: 0px;
}

.emote-data {
  display: flex;
  min-width: 200px;
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

.emote-:hover {
  transform: scale(3);
  z-index: 2;
}

.emote-name {
  max-width: 10em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-variant: small-caps;
}

.emote-count {
  align-self: flex-end;
  text-align: right;
  font-family: monospace;
}
</style>