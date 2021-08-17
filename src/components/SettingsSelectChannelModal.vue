<template>
  <div class="modal is-active">
    <div class="modal-background" @click="closeModal()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Change Channel</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeModal()"
        ></button>
      </header>
      <section class="modal-card-body">
        <div
          class="validation-msg"
          :class="isValid ? 'has-text-success' : 'has-text-danger'"
        >
          {{ (isValid ? "✓ " : "✘ ") + validationMsg }}
        </div>
        <input
          id="settings-select-channel-input"
          class="input"
          type="text"
          v-model.trim="channel"
          aria-label="channel input"
          @keyup.enter="isValid ? setChannelNameAndID() : null"
        />
        <div class="control">
          <label for="nameOrTwitchID" class="radio">
            <input
              class="radioButton"
              type="radio"
              name="nameOrTwitchID"
              v-model="nameOrTwitchID"
              aria-label="radio button to select username"
              value="username"
              checked
            />
            Name
          </label>
          <label class="radio">
            <input
              class="radioButton"
              type="radio"
              name="nameOrTwitchID"
              v-model="nameOrTwitchID"
              aria-label="radio button to select Twitch ID #"
              value="twitchID"
            />
            Twitch ID #
          </label>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-success"
          :disabled="!isValid"
          @click="isValid ? setChannelNameAndID() : null"
        >
          Save
        </button>
        <button class="button" @click="closeModal()">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from "vue";
import { useStore } from "../store";

const twitchUsernameRequirements =
  "Name must be 4-25 alphanumeric characters (underscores (_) allowed)";
const twitchIDRequirements = "Twitch ID must be 8 digits";

export default defineComponent({
  name: "SettingsSelectChannelModal",
  props: {
    closeModal: Function,
  },
  setup(props) {
    const store = useStore();

    const channel = ref("");
    const nameOrTwitchID = ref("username");
    const isValid = ref(false);
    const validationMsg = ref(`${twitchUsernameRequirements}`);

    function validateChannel(value) {
      let trimmedValue = value.trim();
      if (nameOrTwitchID.value === "username") {
        validationMsg.value = `${twitchUsernameRequirements}`;
        if (trimmedValue[0] === "_") {
          isValid.value = false;
          validationMsg.value = "Name cannot start with an underscore (_)";
        } else {
          if (!/^[a-zA-Z0-9_]{4,25}$/.test(trimmedValue)) {
            isValid.value = false;
          } else {
            isValid.value = true;
          }
        }
      }

      if (nameOrTwitchID.value === "twitchID") {
        validationMsg.value = twitchIDRequirements;
        if (!/^[0-9]{6,9}$/.test(trimmedValue)) {
          isValid.value = false;
        } else {
          isValid.value = true;
        }
      }
    }

    function setChannelNameAndID() {
      let params = { username: "", twitchID: "" };
      const radioButtons =
        document.querySelectorAll<HTMLInputElement>(".radioButton");
      radioButtons.forEach((radioButton) => {
        if (radioButton.value === nameOrTwitchID.value) {
          params[radioButton.value] = channel.value;
        }
      });
      store.dispatch("fetchChannelUsernameAndIDFromTwitch", params);
      props.closeModal();
      channel.value = "";
    }

    watchEffect(() => {
      validateChannel(channel.value);
    });

    return {
      channel,
      nameOrTwitchID,
      isValid,
      validationMsg,
      validateChannel,
      setChannelNameAndID,
    };
  },
});
</script>

<style scoped>
.validation-msg {
  padding-bottom: 4px;
}
</style>