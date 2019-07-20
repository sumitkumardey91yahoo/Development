<template>
  <div class="popup-lang-filt alt-popup-bg dark-bg">
    <!-- Color Line -->
    <div class="color-line"></div>

      <div class="pin-screen-header">
        <div class="popup-head">
          <h4 class="popup-title">
            Preferred Regional Language
          </h4>
        </div>
        <div class="popup-head-ico">
          <img
            src="../../assets/close.svg"
            class="kids-pin-close cross_width"
            @click="closeScreen" alt='lan-close' />
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="popup-langfil-box">
        <p class ="languageHeader" v-if="regionalMessages">{{regionalMessages.forAnonymousUsers}}</p>
        <ul class="lang-list overflowLanguage" id="scrolling_language">
          <li class="welcomeLanguage" v-for="(language, i) in languages" :key="i"><span> <img src="../../assets/White_check.svg" alt="failure-block" style="width:15px"></span><span style="padding-left: 20px;">{{language}}</span></li>
        </ul>

      </div>
        <div class="lang-filt-popup-btns languageButton">
          <button type="button" class="btn grad-btn btn-lg" @click="goForSign" v-if="regionalMessages">{{regionalMessages.submitButtonText}}</button>
            <p class="link-under" style="text-align:center" @click="goForDone">SKIP FOR NOW</p>
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
      regionLanguage: undefined,
      myStyles: undefined,
      // Property is mutated in initPopup method
      languages: [
        'English',
        'Hindi'
      ],
      regionalMessages: undefined
    };
  },
  computed: {
    ...mapGetters([
      'appActive',
    ])
  },
  watch: {
    appActive() {
      this.initPopup();
    }
  },
  methods: {
    ...mapMutations([

    ]),
    ...mapActions([
    ]),
    initPopup () {
      // Get the config data from localStorage
      let altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }

      // If not able to get config data, exit out
      if (!altConfig) return;

      // Setting value regionalMessages data property
      if (altConfig.regional && altConfig.regional.messages) {
        this.regionalMessages = altConfig.regional.messages;
      }

      // If languages are empty in the regional language list in the config data
      if (!(altConfig.regional && altConfig.regional.languages && altConfig.regional.languages.length)) return;

      // Make a copy of language property
      let languages = [...this.languages];

      // Map through the regional language array
      altConfig.regional.languages.forEach((item) => {
        if(item.name != 'None') {
          languages.push(item.name);
        }
      });

      // Finally set the languages to the language property
      this.languages = languages;
    },
    closeScreen() {
      // Close the popup
      eventBus.$emit('toggleLanguageFeatureAnonymousEvent', false);

      if(document.getElementById('body')) {
        document.getElementById('body').style.position = "relative";
      }

      // Store Language Preference to local storage
      this.setPrefLangData();
    },
    goForDone() {
      // NOTE analytics
      this.languageAnalyticsAction('skip_now');
      // NOTE analytics

      // Store Language Preference to local storage
      this.setPrefLangData();

      // Close the popup
      eventBus.$emit('toggleLanguageFeatureAnonymousEvent', false);
      if(document.getElementById('body')) {
        document.getElementById('body').style.position = "relative";
      }
    },
    languageAnalyticsAction(action) {
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_mode = 'content_language';
        eventAttributeObj.event_action = action ? action : 'N.A';

        // console.log('[PopupLanguagePrefAnonymous -> languageAnalyticsAction -> ]', eventAttributeObj);

        window.mobileAnalyticsClient.recordEvent('_popup.select', eventAttributeObj, {});
      }
    },
    goForSign() {
      // NOTE analytics
      this.languageAnalyticsAction('register_now');
      // NOTE analytics

      // Store Language Preference to local storage
      this.setPrefLangData();

      // Close the popup
      eventBus.$emit('toggleLanguageFeatureAnonymousEvent', false);

      if(document.getElementById('body')) {
        document.getElementById('body').style.position = "relative";
      }
      // Route to login page
      this.$router.push({ name: 'login' });
    },
    setPrefLangData () {
      let pref_language_data = { userType: 'anonymous', emitted: true };

      localStorage.setItem('pref_language_data', JSON.stringify(pref_language_data));
    },
    screenRotationSizeChange() {
      var originalHeight = undefined;
      var heightPer = undefined;
      originalHeight = screen.height;

    //  // console.log(window.screen.orientation.type);
      if(originalHeight > 399) {
        heightPer = 70;
      } else {
        heightPer = 30;
      }
      if (document.getElementById("scrolling_language")) {
        document.getElementById("scrolling_language").style.height = (originalHeight * heightPer) / 100;
        this.myStyles = {height:(originalHeight * heightPer) / 100 + "px"};
        // NOTE removed emit

        // console.log('[myStyles ]', this.myStyles);
        // eventBus.$emit('languageRotation', function() {
        //   this.myStyles = {height:(originalHeight * heightPer) / 100 + "px"};
        //   document.getElementById("scrolling_language").style.height = (originalHeight * heightPer) / 100;
        // });
      }
    },
  },
  created() {
    if (this.appActive) {
      // NOTE: CODE CHANGE
      // Initialize the popup from here
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      //  eventBus.$on('languageRotation', true);
      this.initPopup();
    }
  },
  mounted() {
    // Listen for orientation changes
    var self = this;
    this.screenRotationSizeChange();
    window.addEventListener("orientationchange", function() {
     // console.log("rotation");
      self.screenRotationSizeChange();
    }, false);
  },
  mixins: [altMixins]
}
</script>

<style lang="css" scoped>
</style>
