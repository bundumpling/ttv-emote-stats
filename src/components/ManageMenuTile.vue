<template>
  <router-link to="./manage/update-emotes">
    <div
      class="menu-tile"
      :class="isHoveredOver ? 'menu-tile-hovered' : ''"
      :style="`background-image: url('/img/ManageMenuTile/${$props.backgroundPath}')`"
      v-on:mouseover="mouseOver"
      v-on:mouseout="mouseOut"
    >
      <div class="menu-tile-text">
        <span>{{ $props.text }}</span>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ManageMenuTile",
  components: {},
  props: {
    backgroundPath: String,
    text: String,
  },
  setup() {
    const isHoveredOver = ref(false);

    const mouseOver = () => {
      isHoveredOver.value = true;
    };

    const mouseOut = () => {
      isHoveredOver.value = false;
    };
    return {
      isHoveredOver,
      mouseOver,
      mouseOut,
    };
  },
});
</script>

<style lang="scss">
.menu-tile {
  width: 284px;
  height: 224px;

  margin: 1em;

  border: 8px solid #333;
  border-radius: 8px;

  filter: grayscale(60%);
  color: #eee;
}

.menu-tile-hovered {
  filter: none;
  color: #f56512;
  cursor: pointer;
}

.menu-tile-text {
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  span {
    align-self: center;
    flex-grow: 1;
    font-size: 2.2em;
    font-weight: bold;
    font-variant: small-caps;
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>