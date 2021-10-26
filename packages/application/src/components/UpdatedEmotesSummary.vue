<template>
  <div v-if="newEmotes.size">
    <div
      class="text-center text-lg font-inconsolata font-extrabold tracking-wide"
    >
      New Emotes
    </div>
    <ul class="my-4 flex justify-evenly flex-wrap items-stretch">
      <li
        v-for="[code, emotes] in newEmotes"
        :key="code"
        class="m-2 flex justify-evenly border-2 border-green-300 rounded-md p-2"
      >
        <div class="p-2 flex flex-col items-center">
          <img
            class="w-8 flex"
            :src="emotes[0].image"
            :alt="`${code} from ${emotes[0].provider}`"
          />
          <div class="font-inconsolata font-semibold tracking-wider">
            {{ code }}
          </div>
        </div>
        <ul class="flex flex-col justify-evenly">
          <li
            v-for="(emote, index) in emotes"
            :key="`${emote.code}-${emote.provider}`"
            class="p-1 font-bold tracking-wide text-center"
            :class="index === 0 ? 'border-2 border-green-500 rounded-md' : ''"
          >
            {{ emote.provider }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div v-if="obsoleteEmotes.size">
    <div
      class="text-center text-lg font-inconsolata font-extrabold tracking-wide"
    >
      Obsolete Emotes
    </div>
    <ul class="my-4 flex justify-evenly flex-wrap items-stretch">
      <li
        v-for="[code, emote] in obsoleteEmotes"
        :key="code"
        class="m-2 flex justify-evenly border-2 border-rose-300 rounded-md p-2"
      >
        <div class="p-2 flex flex-col items-center">
          <img
            class="w-8 flex"
            :src="emote.image"
            :alt="`${code} from ${emote.provider}`"
          />
          <div class="font-inconsolata font-semibold tracking-wider">
            {{ code }}
          </div>
        </div>
        <div class="flex flex-col justify-evenly">
          <div
            class="
              p-1
              font-bold
              tracking-wide
              text-center
              border-2 border-red-500
              rounded-md
            "
          >
            {{ emote.provider }}
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-if="updatedEmotes.size">
    <div
      class="text-center text-lg font-inconsolata font-extrabold tracking-wide"
    >
      Updated Emotes
    </div>
    <ul class="my-4 flex justify-evenly flex-wrap items-stretch">
      <li
        v-for="[code, updateData] in updatedEmotes"
        :key="code"
        class="
          m-2
          flex flex-col
          justify-evenly
          border-2 border-blue-300
          rounded-md
          p-2
        "
      >
        <div class="flex justify-evenly">
          <div class="p-2 flex flex-col items-center">
            <img
              class="w-8 flex"
              :src="updateData.newEmote.image"
              :alt="`${code} from ${updateData.newEmote.provider}`"
            />
            <div class="font-inconsolata font-semibold tracking-wider">
              {{ code }}
            </div>
          </div>
          <div class="flex flex-col justify-evenly">
            <div
              class="
                p-1
                font-bold
                tracking-wide
                text-center
                border-2 border-blue-500
                rounded-md
              "
            >
              {{ updateData.newEmote.provider }}
            </div>
          </div>
        </div>
        <ul class="p-2 flex flex-col items-center">
          <li
            v-for="line in updateData.infoLines"
            :key="`${code}-${line}`"
            class="text-center text-sm font-mono"
          >
            {{ line }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ComputedRef } from "vue";
import { UseEmotesFromProviders, UseEmotesFromDatabase, Emote } from "@/types";

export default defineComponent({
  name: "UpdatedEmotesSummary",
  props: {
    emotesFromProviders: {
      type: Object as PropType<UseEmotesFromProviders>,
      required: true,
    },
    emotesFromDatabase: {
      type: Object as PropType<UseEmotesFromDatabase>,
      required: true,
    },
  },
  setup(props) {
    const newEmotes: ComputedRef<Map<string, Emote[]>> = computed(() => {
      const newEmotesMap: Map<string, Emote[]> = new Map();
      props.emotesFromProviders.emotesByCode.value.forEach(
        (v: Emote[], k: string) => {
          if (!props.emotesFromDatabase.emotesByCode.value.has(k)) {
            newEmotesMap.set(k, v);
          }
        }
      );
      return newEmotesMap;
    });

    const obsoleteEmotes: ComputedRef<Map<string, Emote>> = computed(() => {
      const obsoleteEmotesMap: Map<string, Emote> = new Map();
      props.emotesFromDatabase.emotesByCode.value.forEach(
        (v: Emote, k: string) => {
          if (!props.emotesFromProviders.emotesByCode.value.has(k)) {
            obsoleteEmotesMap.set(k, v);
          }
        }
      );
      return obsoleteEmotesMap;
    });

    const updatedEmotes: ComputedRef<
      Map<string, { oldEmote: Emote; newEmote: Emote; infoLines: string[] }>
    > = computed(() => {
      const updatedEmotesMap: Map<
        string,
        { oldEmote: Emote; newEmote: Emote; infoLines: string[] }
      > = new Map();
      props.emotesFromDatabase.emotesByCode.value.forEach(
        (v: Emote, k: string) => {
          if (props.emotesFromProviders.emotesByCode.value.has(k)) {
            const comparisonEmoteFromProvider =
              props.emotesFromProviders.emotesByCode.value.get(k)[0];
            if (
              v.provider !== comparisonEmoteFromProvider.provider ||
              v.providerID !== comparisonEmoteFromProvider.providerID ||
              v.image !== comparisonEmoteFromProvider.image
            ) {
              const infoLines = [];
              if (v.provider !== comparisonEmoteFromProvider.provider) {
                infoLines.push(
                  `Provider changed from ${v.provider} to ${comparisonEmoteFromProvider.provider}.`
                );
              }
              if (v.providerID !== comparisonEmoteFromProvider.providerID) {
                infoLines.push(`Updated emote's provider ID.`);
              }
              if (v.image !== comparisonEmoteFromProvider.image) {
                infoLines.push(`Emote's image updated.`);
              }
              updatedEmotesMap.set(k, {
                oldEmote: v,
                newEmote: comparisonEmoteFromProvider,
                infoLines,
              });
            }
          }
        }
      );
      return updatedEmotesMap;
    });

    return {
      newEmotes,
      obsoleteEmotes,
      updatedEmotes,
    };
  },
});
</script>
