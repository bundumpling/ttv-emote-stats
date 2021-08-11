<template>
  <div :class="'modal ' + (isActive ? 'is-active' : '')">
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
        <input
          id="settings-select-channel-input"
          class="input"
          type="text"
          aria-label="channel input"
        />
        <div class="control">
          <label for="nameOrTwitchID" class="radio">
            <input
              type="radio"
              name="nameOrTwitchID"
              aria-label="radio button to select username"
              value="username"
              checked
            />Name
          </label>
          <label class="radio">
            <input
              type="radio"
              name="nameOrTwitchID"
              aria-label="radio button to select Twitch ID #"
              value="twitchID"
            />Twitch ID #
          </label>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="setChannelNameAndID()">
          Save
        </button>
        <button class="button" @click="closeModal()">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { store } from "../store";
export default {
  name: "SettingsSelectChannelModal",
  props: {
    isActive: Boolean,
    closeModal: Function,
  },
  methods: {
    setChannelNameAndID() {
      let selectChannelInputValue = document.getElementById(
        "settings-select-channel-input"
      ).value;
      let radioButtonChecked = "";
      const radioButtons = document.getElementsByName("nameOrTwitchID");
      radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
          radioButtonChecked = radioButton.value;
        }
      });
      let username =
        radioButtonChecked === "username" ? selectChannelInputValue : "";
      let twitchID =
        radioButtonChecked === "twitchID" ? selectChannelInputValue : "";
      store.setChannelNameAndID(username, twitchID);
      this.closeModal();
    },
  },
};
</script>

<style>
</style>