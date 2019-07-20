<template>
  <div class="kids-exit-pin-screen alt-popup-bg dark-bg" id="kids-exit-pin-screen">
    <div class="pin-screen-header">
      <img src="../../assets/close.svg" class="kids-pin-close" alt="close" @click="closePopup">
    </div>
    <div class="pin-screen-box">
      <p v-if="altMessages" style="white-space: pre-wrap;">{{altMessages.kidsModeExitMessage}}</p>

      <div class="pin-control-box">
        <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." @keyup="validateExitPin" v-model="exitPin" id="alt-kids-exit-pin-elm" autofocus>
      </div>

      <p class="pin-error" v-show="pinError">{{pinError}}</p>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      exitPin: '',
      pinError: false,
      altUser: false,
    };
  },
  computed: {
    ...mapGetters([
      'passphrase',
      'altMessages',
    ])
  },
  methods: {
    ...mapMutations([

    ]),
    ...mapActions([
      'actEditAccount',
      'actCreateNewProfile',
      'actCheckWithAccount',
      'actGetProfileSwitch',
      'actGetProfileSwitch',
    ]),
    validateExitPin(event) {
      if (event.target.value.length == 4) {
        // Show the App Loader
        this.toggleLoader(true);
        // Disable the error message first
        this.pinError = false;
        // Check the user account for profile and pin
        this.checkUserAccount();
      }
    },
    checkUserAccount() {
      this.actCheckWithAccount().then((response) => {
        if (response.count) {
          // Get the kids profile from the response
          var defaultProfile = response.profiles[0];
          defaultProfile.pin = this.exitPin;

          this.switchToDefaultProfile(defaultProfile);
        } else {
          // If kids account was not there
          // show the create kids pin popup
          this.$router.push({ name: 'createKidsPin' });
        }
      }, (error) => {
        if (error.code && error.code == 404) {
          eventBus.$emit('togglePopupDeviceRemoved', false);
        } else {
          // Clear all the user data
          this.clearUserData();
          // Emit an event to App.vue to change the app mode to default
          eventBus.$emit('toggleAppModeChangeEvent', 'default');
          // Reload the page, so that after checking the user data and profile mode, the page will be redirected to the homepage with anonymous mode.
          window.location.reload();
        }
      });
    },
    switchToDefaultProfile(defaultProfile) {
      this.actGetProfileSwitch(defaultProfile).then((response) => {
        // console.log('[switchToDefaultProfile > response]', response);

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (altUser) {
          altUser.sessionToken = response.session_token;
          altUser.uuid = response.uuid;
          altUser.username = response.username;

          localStorage.setItem('altUser', JSON.stringify(altUser));
        }

        eventBus.$emit('toggleAppModeChangeEvent', 'default');
        this.closePopup();
        this.$router.push({ name: 'home' });
      }).catch((error) => {
        if (error.code == 401) {
          // NOTE commented by sumit for text change "Incorrect Pin"
          // this.pinError = error.message ? error.message : 'Wrong Pin';
          this.pinError = error.message ? 'Incorrect PIN' : 'Wrong Pin';
          this.toggleLoader(false);
        }
      });
    },
    switchProfile() {
      this.actGetProfileSwitch(this.altKidsUser).then((response) => {
        if (response) {
          this.altKidsUser.sessionToken = response.session_token;
          this.altKidsUser.uuid = response.uuid;
          this.altKidsUser.parentalControl = response.parental_control;
          localStorage.setItem('altProfileMode', 'kids');
          localStorage.setItem('altKidsUser', JSON.stringify(this.altKidsUser));
          /**
          * route to kids page
          */
          this.$router.push({ name: 'kidsMode' });
        }
      }, (error) => {
        // console.log(error);
      });
    },
    validateConfimPin(event) {
      if (event.target.value.length > 3) {
        if (this.firstPin == this.confirmPin) {
          var altUser = JSON.parse(localStorage.getItem('altUser'));

          this.actEditAccount({
            marketingConsent: false,
            pin: this.firstPin,
            details: {},
            Account_Id: altUser.accountId,
            Profile_Id: altUser.profileId
          }).then((response) => {
            // console.log('[KidsCreatePin | validateConfimPin | response | ]', response);

            if (response.status && response.status == 'ok') {
              this.createKidsProfile();
            }
          }, (error) => {
            // console.log('[KidsCreatePin | validateConfimPin | error | ]', error);
          })
        } else {
          this.pinError = 'Incorrect PIN';
        }
      }
    },
    createKidsProfile() {
      var altUser = JSON.parse(localStorage.getItem('altUser'));
      var altKidsUser = {
        parental_control: 'R',
        password: altUser.login,
        type: 'regular',
        username: 'kids' + altUser.login
      };

      this.actCreateNewProfile(altKidsUser).then((response) => {
        this.switchProfile(altKidsUser);
      }, (error) => {
        // console.log('[KidsCreatePin | validateConfimPin | error | ]', error);
      })
    },
    switchProfile(altKidsUser) {
      var altUser = JSON.parse(localStorage.getItem('altUser'));
      var profileObj = { pin: this.firstPin, profileId: altUser.profileId };

      this.actGetProfileSwitch(profileObj).then((response) => {
        altKidsUser.email = response.email;
        altKidsUser.parentalControl = response.parental_control;
        altKidsUser.sessionToken = response.session_token;
        altKidsUser.username = response.username;
        altKidsUser.uuid = response.uuid;

        localStorage.setItem('altKidsUser', JSON.stringify(altKidsUser));
        localStorage.setItem('altProfileMode', 'kids');
        this.$router.push({ name: 'home' });
      }, (error) => {
        // console.log('[KidsCreatePin | switchProfile | actGetProfileSwitch | error | ]', error);
      });
    },
    closePopup() {
      this.exitPin = '';
      this.pinError = false;
      eventBus.$emit('togglePopupKidsExitPin', false);
    },
  },
  created() {
    if (localStorage.getItem('altUser')) {
      this.altUser = JSON.parse(localStorage.getItem('altUser'));
    }
  },
  mounted() {
    // console.log('[PopupKidsExitPin | mounted | ]');
  },
  mixins: [altMixins]
}
</script>
