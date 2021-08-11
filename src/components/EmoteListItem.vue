<template>
  <li
    :class="
      'emote-list-item ' +
      (rangeStart <= index && index <= rangeEnd
        ? ''
        : 'emote-list-item--hidden')
    "
  >
    <div class="emote-wrapper">
      <img class="emote-thumb" :alt="emote.name" v-bind:src="emote.image" />
    </div>
    <div class="emote-name">
      {{ emote.name }}
    </div>
    <div class="emote-count">
      {{ emote.count }}
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
  position: relative;
  height: 24px;
  font-size: 24px;
  counter-increment: count;
  margin-bottom: 10px;
  line-height: 24px;
}

.emote-list-item:before {
  content: counter(count);
  text-align: right;
  width: 24px;
  line-height: 24px;
  position: absolute;
  left: 0px;
  top: 0px;
  vertical-align: middle;
  font-weight: bold;
}

.emote-list-item--hidden {
  visibility: hidden;
  max-height: 0px;
}

.emote-wrapper {
  position: absolute;
  display: inline-block;
  top: 0;
  left: 36px;
  width: 24px;
  height: 24px;
  line-height: 24px;
}

.emote-wrapper:hover {
  transform: scale(3);
  z-index: 2;
}

.emote-count {
  position: absolute;
  display: inline-block;
  right: 0px;
  width: 80px;
  text-align: right;
}

.emote-thumb {
  position: relative;
  display: inline-block;
}

.emote-name {
  position: absolute;
  left: 70px;
  font-size: 14px;
  font-variant: small-caps;
}
</style>