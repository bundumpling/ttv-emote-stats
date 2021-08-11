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
        <input
          id="settings-select-channel-input"
          class="input"
          type="text"
          aria-label="channel input"
          @keyup.enter="setChannelNameAndID()"
        />
        <div class="control">
          <label for="nameOrTwitchID" class="radio">
            <input
              type="radio"
              name="nameOrTwitchID"
              aria-label="radio button to select username"
              value="username"
              checked
            />
            Name
          </label>
          <label class="radio">
            <input
              type="radio"
              name="nameOrTwitchID"
              aria-label="radio button to select Twitch ID #"
              value="twitchID"
            />
            Twitch ID #
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
export default {
  name: "SettingsSelectChannelModal",
  props: {
    closeModal: Function,
  },
  methods: {
    setChannelNameAndID() {
      const selectChannelInput = document.getElementById(
        "settings-select-channel-input"
      );
      let params = { username: "", twitchID: "" };
      const radioButtons = document.getElementsByName("nameOrTwitchID");
      radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
          params[radioButton.value] = selectChannelInput.value;
        }
      });
      this.$store.commit("setChannelNameAndID", params);
      this.closeModal();
      selectChannelInput.value = "";
    },
  },
};
</script>

<style>
</style>