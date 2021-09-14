<template>
  <div class="condensed-view">
    <div class="pending-changes">
      <div class="pending-changes-summary-group">
        <div
          v-for="(category, index) in summary"
          :key="index"
          class="pending-changes-summary-group-item"
        >
          <div
            class="pending-changes-summary-group-item-header"
            @click="toggleCategoryExpanded(category.displayText)"
            v-bind:style="{
              'background-color': `${colorFromKey(index)}50`,
              'border-color': colorFromKey(index),
              'border-bottom-width': category.emotes.length
                ? `4px solid ${colorFromKey(index)}`
                : `8px solid ${colorFromKey(index)}`,
            }"
          >
            <div class="pending-changes-summary-group-item-header-icon">
              <font-awesome-icon
                :icon="
                  getCategoryExpandedState(category.displayText)
                    ? 'compress-alt'
                    : 'expand-alt'
                "
              />
            </div>
            <div class="pending-changes-summary-group-item-header-category">
              {{ category.displayText }}
            </div>
            <div class="pending-changes-summary-group-item-header-count">
              {{ `${category.emotes.length} items` }}
            </div>
          </div>
          <div
            v-if="getCategoryExpandedState(category.displayText)"
            class="pending-changes-summary-group-item-emotelist"
          >
            <div
              v-for="(emote, emoteIndex) in category.emotes"
              :key="emote.code"
              class="pending-changes-summary-group-item-emotelist-item"
              v-bind:style="{
                'border-color': colorFromKey(index),
                'border-bottom-width':
                  emoteIndex + 1 < category.emotes.length ? '0px' : '8px',
              }"
            >
              <span><img :src="emote.image" /></span>
              <span
                class="pending-changes-summary-group-item-emotelist-item-code"
                >{{ emote.code }}</span
              >
              <span
                class="
                  pending-changes-summary-group-item-emotelist-item-provider
                "
                >{{ emote.provider }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box emoteset">
      <img
        class="emote"
        v-for="emote in updatedEmotes"
        :key="emote.code"
        :src="emote.image"
        v-bind:style="{ 'border-color': colorFromEmote(emote) }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed } from "vue";
import { EmoteForUpdate } from "../types";

export default defineComponent({
  name: "ManageUpdateEmotesCondensedView",
  props: {
    updatedEmotes: {
      type: Array as PropType<EmoteForUpdate[]>,
      required: true,
    },
  },
  setup(props) {
    const colors: {
      [key: string]: string;
    } = {
      isNew: "#319a2d",
      isUnavailable: "#c91010",
      isUpdated: "#1d61ae",
    };

    const categoryExpandedState = reactive<{ [key: string]: any }>({
      New: false,
      Unavailable: false,
      Updated: false,
    });

    const summary = computed(() => {
      const result: {
        [key: string]: {
          displayText: string;
          emotes: EmoteForUpdate[];
        };
      } = {
        isNew: {
          displayText: "New",
          emotes: [],
        },
        isUnavailable: {
          displayText: "Unavailable",
          emotes: [],
        },
        isUpdated: {
          displayText: "Updated",
          emotes: [],
        },
      };

      props.updatedEmotes.forEach((emote: EmoteForUpdate): void => {
        if (emote.isNew) result.isNew.emotes.push(emote);
        else if (emote.isUnavailable) result.isUnavailable.emotes.push(emote);
        else if (emote.isUpdated) result.isUpdated.emotes.push(emote);
      });

      return Object.keys(result).reduce((acc: any, cur) => {
        if (result[cur].emotes.length) {
          acc[cur] = result[cur];
          return acc;
        } else {
          return acc;
        }
      }, {});
    });

    function colorFromKey(key: string | number): string {
      return colors[key];
    }

    function colorFromEmote(emote: EmoteForUpdate): string {
      if (emote.isNew) return colors.isNew;
      if (emote.isUnavailable) return colors.isUnavailable;
      if (emote.isUpdated) return colors.isUpdated;

      return "transparent";
    }

    function toggleCategoryExpanded(categoryName: string) {
      categoryExpandedState[categoryName] =
        !categoryExpandedState[categoryName];
    }

    function getCategoryExpandedState(categoryName: string) {
      return categoryExpandedState[categoryName];
    }

    return {
      summary,
      colorFromKey,
      colorFromEmote,
      toggleCategoryExpanded,
      getCategoryExpandedState,
    };
  },
});
</script>

<style lang="scss">
.condensed-view {
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-evenly;
}

.pending-changes {
  flex-basis: 30%;
}

.emoteset {
  flex-basis: 60%;
}

.pending-changes-summary-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.pending-changes-summary-group-item {
  margin-top: 8px;
}

.pending-changes-summary-group-item-header {
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  border-width: 8px;
  border-style: solid;
  text-align: center;
  font-size: 1.4em;
  font-variant: small-caps;
  font-weight: bold;
  cursor: pointer;
}

.pending-changes-summary-group-item-header-icon {
  padding-left: 4px;
}

.pending-changes-summary-group-item-header-category {
  align-self: center;
}

.pending-changes-summary-group-item-header-count {
  padding-right: 4px;
}

.pending-changes-summary-group-item-emotelist-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  padding: 4px;
  border-width: 0 8px;
  border-style: solid;
}

.pending-changes-summary-group-item-emotelist-item-code {
  font-family: monospace;
}

.pending-changes-summary-group-item-emotelist-item-provider {
  font-weight: bold;
}

.emote {
  border: 3px solid transparent;
  margin: 2px;
}
</style>