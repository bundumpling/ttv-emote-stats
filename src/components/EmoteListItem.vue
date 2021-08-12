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
        {{ emote.name }}
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

<style>
.emote-list-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  height: 24px;
  font-size: 24px;
  counter-increment: count;
  margin-bottom: 10px;
  line-height: 24px;
}

.emote-list-item:before {
  content: counter(count);
  text-align: right;
  width: 36px;
  line-height: 24px;
  font-weight: bold;
}

.emote-list-item--hidden {
  visibility: hidden;
  max-height: 0px;
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
  font-size: 14px;
  font-variant: small-caps;
}

.emote-count {
  align-self: flex-end;
  text-align: right;
  font-family: monospace;
}
</style>