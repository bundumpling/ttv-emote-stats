<template>
  <li id="emote-list-item">
    <div class="emote-wrapper">
      <img
        class="emote-thumb"
        v-bind:src="
          'img/emotes/' + emote.name + (emote.animated ? '.gif' : '.png')
        "
      />
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
  props: ["emote"],
};
</script>

<style>
#emote-list-item {
  position: relative;
  height: 24px;
  font-size: 24px;
  counter-increment: count;
  margin-bottom: 10px;
  line-height: 24px;
}

#emote-list-item:before {
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