<template>
  <div class="alt-popup-bg dark-bg" style="overflow:auto;">
    <div class="list-table container">
      <h1 class="homeTitle" v-if="altMessages">{{altMessages.messagePostSignUpWelcomeTitle}}</h1>
      <img v-if="altConfig" :src="altConfig.welcomePage.default.url.android_phone"></img>
      <h1 class="homeSubTitle" v-if="altConfig">{{altConfig.welcomePage.default.title}}</h1>
      <h2 class="homeSubTitlePart" v-if="altConfig">{{altConfig.welcomePage.default.description}}</h2>

      <button type="button" class="btn grad-btn btn-lg" @click="subscribeRedirection" v-if="altMessages">{{altMessages.buttonSubscribeNowMultiple}}</button>

      <p class="link-under center-skip" @click="homeRedirect" v-if="altMessages">{{altMessages.buttonSkipNowMultiple}}</p>
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
      altConfig : undefined,
    };
  },
  computed: {
    ...mapGetters([
      'altMessages',
      'routerToParam',
      'routerFromParam',
      'appActive',
    ])
  },
  watch: {
    appActive() {
    //  // console.log("popupsignupWelcomepagePage.vue|appActive");
      if(localStorage.getItem('altConfig')) {
        this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }
    }
  },
  methods: {
    subscribeRedirection() {
      this.closePopup();
      this.$router.push({ name: 'subscribe' });
    },
    homeRedirect () {
      this.closePopup();

      // NOTE added by sumit
      if (this.routerFromParam) {
        if (this.routerFromParam.name == 'media' || this.routerFromParam.name == 'show' || this.routerFromParam.name == 'episode') {
          this.$router.push(this.routerFromParam.fullPath);
        } else if (this.routerFromParam.name == 'kids') {
          this.$router.push({ name: 'subscribe' });
        } else if (this.routerFromParam.name == 'rent') {
          this.$router.push(this.routerFromParam.fullPath);
        } else {
          this.$router.push({ name: 'home' });
        }
      } else {
        this.$router.push({ name: 'home' });
      }
    },
    closePopup() {
        
        if(document.getElementById('alt-app')) {
            document.getElementById('alt-app').style.position = "relative";
        }
        eventBus.$emit('togglePopupSignupWelcomePageEvent', false);
    },
  },
  created() {
    // console.log("this.routerFromParam",this.routerFromParam)
    if (this.appActive) {
    //  // console.log("popupsignupWelcomepagePage.vue|created|appActive");
      if(localStorage.getItem('altConfig')) {
        this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }
    }
  },
  mounted() {
  //  // console.log("popupsignupWelcomepagePage.vue|mounted");
    if(localStorage.getItem('altConfig')) {
      this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
    }
  },
  mixins: [altMixins]
}
</script>
