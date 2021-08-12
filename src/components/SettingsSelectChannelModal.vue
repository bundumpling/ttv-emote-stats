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
          :class="
            validation.channel.valid ? 'has-text-success' : 'has-text-danger'
          "
        >
          {{
            (validation.channel.valid ? "✓ " : "✘ ") + validation.channel.msg
          }}
        </div>
        <input
          id="settings-select-channel-input"
          class="input"
          type="text"
          v-model.trim="channel"
          aria-label="channel input"
          @keyup.enter="validation.channel.valid ? setChannelNameAndID() : null"
        />
        <div class="control">
          <label for="nameOrTwitchID" class="radio">
            <input
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
          :disabled="!validation.channel.valid"
          @click="validation.channel.valid ? setChannelNameAndID() : null"
        >
          Save
        </button>
        <button class="button" @click="closeModal()">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
const twitchUsernameRequirements =
  "Name must be 4-25 alphanumeric characters (underscores (_) allowed)";
const twitchIDRequirements = "Twitch ID must be 8 digits";
export default {
  name: "SettingsSelectChannelModal",
  data() {
    return {
      channel: "",
      nameOrTwitchID: "username",
      validation: {
        channel: {
          valid: false,
          msg: twitchUsernameRequirements,
        },
      },
    };
  },
  props: {
    closeModal: Function,
  },
  watch: {
    channel(value) {
      this.channel = value;
      this.validateChannel(value);
    },
    nameOrTwitchID() {
      this.validateChannel(this.channel);
    },
  },
  methods: {
    validateChannel(value) {
      let trimmedValue = value.trim();
      if (this.nameOrTwitchID === "username") {
        if (trimmedValue[0] === "_") {
          this.validation.channel.valid = false;
          this.validation.channel.msg =
            "Name cannot start with an underscore (_)";
        } else {
          this.validation.channel.msg = twitchUsernameRequirements;
          if (!/^[a-zA-Z0-9_]{4,25}$/.test(trimmedValue)) {
            this.validation.channel.valid = false;
          } else {
            this.validation.channel.valid = true;
          }
        }
      }

      if (this.nameOrTwitchID === "twitchID") {
        if (!/^[0-9]{8}$/.test(trimmedValue)) {
          this.validation.channel.valid = false;
          this.validation.channel.msg = twitchIDRequirements;
        } else {
          this.validation.channel.valid = true;
        }
      }
    },
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

<style scoped>
.validation-msg {
  padding-bottom: 4px;
}
</style>