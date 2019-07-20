<template>
  <input type="submit" value="LOG OUT" class="signup-btn" @click="showLogoutPopup">
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions([
      'actGetUserLoggedOut',
      'actDeleteDevice',
    ]),
    logoutUser() {
      this.toggleLoader(true);
      this.actGetUserLoggedOut().then((response) => {
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        var altAccount = undefined;
        if (localStorage.getItem('altAccount')) {
          altAccount = JSON.parse(localStorage.getItem('altAccount'));
        }

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.event_mode = 'user';
          window.mobileAnalyticsClient.recordEvent('_user.logout', eventAttributeObj, {});

        }
        // End of AWS Mobile SDK Events

        // NOTE webengage logout added 16.02.2018
        if(webengage) {
          webengage.user.logout();
        }

        // Deletes all the user related data from localStorage
        // (source) mixins.js
        this.clearUserData();

        //NOTE added humbergar menu part ,when user logout.

        eventBus.$emit('changeHumburgerName','Welcome!');

        this.toggleLoader(true);

        this.$router.push({ name: 'home' });
      }, (error) => {
        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.event_action = 'error';
          eventAttributeObj.event_message = error.message;
          eventAttributeObj.event_code = error.code.toString();
          window.mobileAnalyticsClient.recordEvent('_user.logout', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events

        // Deletes all the user related data from localStorage
        // (source) mixins.js
        this.clearUserData();

        this.toggleLoader(false);
        this.$router.push({ name: 'home' });
      });
      eventBus.$off('logoutUserEvent', this.logoutUser);
    },
    showLogoutPopup() {
      if(document.getElementById('alt-app')) {
        document.getElementById('alt-app').style.position = "fixed";
      }

      eventBus.$emit('toggleLogoutPopupEvent', true);
    },
  },  //  end of methods
  created() {
    eventBus.$on('logoutUserEvent', this.logoutUser);
  },
  mixins: [altMixins]
}
</script>
