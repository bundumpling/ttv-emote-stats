<template>
  <div>
    <TheSubheader
      :msg="`Parse Emote Usage from Chat Logs for ${channelName}'s Channel`"
    />
    <section class="info">
      <p>This is a tool for parsing log files from <strong>Chatterino</strong>. In order to work properly, a log file <strong>must</strong> follow a particular format: </p>
      <ul>
        <li>The first line is a 'start logging' status message providing the date, e.g. <code># Start logging at 2021-09-13 00:21:25 Eastern Daylight Time</code></li>
        <li>Each chat line must begin with a timestamp, e.g. <code>[00:24:44]</code></li>
        <li>Each chat line must have a colon following the username, e.g. <code>[01:41:29]  twitchuser: hi streamer and chat FrankerZ</code></li>
      </ul>
    </section>
    <ParseLogContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "../store";
import { useRoute } from "vue-router";
import { MutationType } from "../store/mutations";
import TheSubheader from "../components/TheSubheader.vue";
import ParseLogContainer from "../components/ManageParseLogContainer.vue";

export default defineComponent({
  name: "ParseLogsPage",
  components: {
    TheSubheader,
    ParseLogContainer,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const channelName = route.params.channelName;

    onMounted(() => {
      // reduce unnecessary backend api calls
      if (
        !store.state.settings.channelEmoteData ||
        !store.state.settings.channelEmoteData.emotesFromProviders ||
        !store.state.settings.channelEmoteData.emotesFromProviders.length ||
        store.state.settings.channelEmoteData.channelName !== channelName
      ) {
        store.commit(MutationType.ResetLogParserResults, undefined);
        store.dispatch("getChannelEmoteCodes", channelName);
      }
    });

    // function resetFileInputElement() {
    //   const inputElement = document.getElementById(
    //     "logfile-input"
    //   ) as HTMLInputElement;
    //   if (inputElement) {
    //     inputElement.value = "";
    //   }
    // }
    // function saveResultsToDB(): void {
    //   store.dispatch("saveLogParserResultsToDB");
    //   resetFileInputElement();
    // }

    // function saveAll() {
    //   // TODO
    // }

    // In order for the change event to fire, a different file must be uploaded.
    // By setting the input element's value to zero, the same log file can be processed multiple times.
    // document.getElementById("input").value = "";
    return {
      channelName,
      // saveAll,
      // saveResultsToDB,
    };
  },
});
</script>

<style lang="scss" scoped>
.info {
  width: 70%;
  margin: 1em auto;

  ul {
    padding: 0 1em;
    list-style-type: circle;
    list-style-position: inside;
  }
}
</style>