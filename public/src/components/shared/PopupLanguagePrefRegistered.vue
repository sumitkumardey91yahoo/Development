<template>
  <div class="popup-lang-filt alt-popup-bg dark-bg">
    <!-- Color Line -->
    <div class="color-line"></div>

    <!-- Header -->
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
          @click="closePopup" alt='lan-close' />
      </div>
      <div class="clearfix"></div>
    </div>

    <div class="popup-langfil-box">
      <p style="text-align: left;" v-if="regionalMessages">{{regionalMessages.forRegisteredUsers}}</p>
     <div class="overflowLanguage">
      <label class="rdo-language" v-for="(language, i) in languages">
        {{language}}
        <input type="radio" name="radio_language" @click="passlanguage(language)" :value="language" v-model="selectedLanguage" />
        <span class="checkmark"></span>
      </label>
    </div>

      <div class="lang-filt-popup-btns languageButton">
        <button type="button" class="btn grad-btn btn-lg" @click="setPreferedLanguage()">DONE</button>
      </div>
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
      languages: [ '' ],
      selectedLanguage: 'None',
      regionalMessages: undefined,
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
      'actPutProfileDetails',
      'actPostProfileDetails'
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
        languages.push(item.name);
      });

      // Finally set the languages to the language property
      this.languages = languages;

      // If Prefered language data exists in local storage, which means the user
      // has already selected the regional language and saved to his profile.
      // Then set the seelcted language data property to the users language
      if (localStorage.getItem('pref_language_data')) {
        let pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));

        // If the user type is not reigtered, then set the default selected language as 'None'
        if (pref_language_data.userType != 'registered') return;

        // Set the selectedLanguage data property
        let selectedLanguage = pref_language_data.language;
        selectedLanguage = (selectedLanguage == '') ? 'None' : selectedLanguage
        this.selectedLanguage = selectedLanguage;

        // console.log('[PopupLanguageFilterFeatureOther -> initPopup -> selectedLanguage ]', this.selectedLanguage);
      }
    },
    closePopup() {
      eventBus.$emit('toggleLanguagePrefRegisterdEvent', false);

      if(document.getElementById('body')) {
        document.getElementById('body').style.position = "relative";
      }

      // Save Language preference to local storage with emitted value to false -
      // which tells that the user has not send the language information to the
      // backend as a POST request. We check the emitted information when we -
      // change the language preference from the popup
      // Before that we need to check, whether the popup has emitted already or -
      // not. If not emitted, then only continue
      // Check for preference from local storage
      if (localStorage.getItem('pref_language_data')) {
        let pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));

        // If popup already emitted, don't save anything and exit out of method
        if (pref_language_data.userType == 'registered' && pref_language_data.emitted) return;
      }
        this.saveLangToLocal('', false);
    },
    passlanguage(language) {
      this.regionLanguage = language;
    },
    setPreferedLanguage () {
      // NOTE: CODE CHANGE
      // Remove Code commented below after review

      // Show the App loader on button click
      this.toggleLoader(false);

      // Save the selected language to user profile (Backend)
      this.savePrefereLanguage(this.selectedLanguage);
      // Send Analytics data
      // _popup.select
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_mode = 'content_language';
        eventAttributeObj.event_action = this.selectedLanguage;

        // console.log('[App -> toggleLanguagePrefRegisterdCB -> eventAttributeObj]', eventAttributeObj);

        window.mobileAnalyticsClient.recordEvent('_popup.select', eventAttributeObj, {});
      }
      // Hide the popup
      eventBus.$emit('toggleLanguagePrefRegisterdEvent', false);

      if(document.getElementById('body')) {
        document.getElementById('body').style.position = "relative";
      }


      // NOTE: CODE COMMENTED
      // if(this.regionLanguage){
      //   localStorage.setItem("Regional-language",JSON.stringify(this.regionLanguage));
      //
      //   if (window.mobileAnalyticsClient) {
      //     var eventAttributeObj = this.getAWSMACommonAttributes();
      //     eventAttributeObj.event_mode = 'content_language';
      //     eventAttributeObj.event_action = this.regionLanguage.name ? this.regionLanguage.name : 'none';
      //     window.mobileAnalyticsClient.recordEvent('_popup.select', eventAttributeObj, {});
      //   }
      //
      //   eventBus.$emit('toggleLanguagePrefRegisterdEvent',false);
      //   location.reload();
      // }
      // NOTE: END CODE COMMENT
    },
    savePrefereLanguage (language) {
      // console.log('[PopupLanguageFilterFeatureOther -> savePrefereLanguage -> language ]', language);

      // We should not send value 'None' to the backend. Instead send empty
      // string ('');
      if (language == 'None') language = '';

      let self = this;

      let pref_language_data = undefined;
      if (localStorage.getItem('pref_language_data')) {
        pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));
      }

      // console.log('[PopupLanguageFilterFeatureOther -> savePrefereLanguage -> pref_language_data ]', pref_language_data);

      // Declare the profile details to be stored
      let profileDetails = {
        // The key name should be 'regional_language'.
        // Reference : E-mail - "Fwd: Regional Language Config Entries"
        regional_language: language
      }

      // If prefered language data exists in localStorage, it means the user has
      // already saved the language in profile
      if (pref_language_data && pref_language_data.userType == 'registered' && pref_language_data.selected) {
        // Defined as inline method
        putPrefLanguage(profileDetails);
      } else {
        // If not already saved
        // Defined as inline method
        postPrefLanguage(profileDetails);
      }

      // After Making API calls to store the language preference,
      // Close the popup
      eventBus.$emit('toggleLanguagePrefRegisterdEvent', false);

      if(document.getElementById('body')) {
        document.getElementById('body').style.position = "relative";
      }

      function putPrefLanguage(details) {
        // Make the API call
        self.actPutProfileDetails(details).then((response) => {
          // Save the data to local storage
          self.saveLangToLocal(language, true);
          // Emit an event so that pages listening to event will get notified and
          // can take appropriate actions
          // Listening pages - AccountProfile.vue
          eventBus.$emit('regionalLanguageSelectedEvent', language);
        }).catch((error) => {
          // Handle error
          // console.log('[PopupLangFilter -> savePrefereLanguage -> putPrefLanguage -> error]', error);
        });
      }

      function postPrefLanguage(details) {
        // Make the API call
        self.actPostProfileDetails(details).then((response) => {
          // Save the data to local storage
          self.saveLangToLocal(language, true);
          // Emit an event so that pages listening to event will get notified and
          // can take appropriate actions
          // Listening pages - AccountProfile.vue
          eventBus.$emit('regionalLanguageSelectedEvent', language);
        }).catch((error) => {
          // Handle error
          // console.log('[PopupLangFilter -> savePrefereLanguage -> postPrefLanguage -> error]', error);
        });
      }

    }, // savePrefereLanguage
    saveLangToLocal (language, selected) {
      let pref_language_data = {
        userType: 'registered',
        emitted: true,
        selected,
        language
      }
      localStorage.setItem('pref_language_data', JSON.stringify(pref_language_data));
      // NOTE @sumit for update home page,
      if(this.$route.name == "home" && language) {
        location.reload();
      }

    }, // saveLangToLocal
    togglePopupCB (state) {
      if (!state) return;

      // When the popup appears, it will select the prefered language based on -
      // the value selected from local storage
      if (localStorage.getItem('pref_language_data')) {
        let pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));

        // If the user type is not reigtered, then set the default selected language as 'None'
        if (pref_language_data.userType != 'registered') return;

        // Set the selectedLanguage data property
        let selectedLanguage = pref_language_data.language;
        selectedLanguage = (selectedLanguage == '') ? 'None' : selectedLanguage
        this.selectedLanguage = selectedLanguage;
      }
    },
    screenRotationSizeChange() {
      var originalHeight = undefined;
      var heightPer = undefined;
      originalHeight = screen.height;
      // console.log(window.screen.orientation.type);
      if(originalHeight > 399) {
        heightPer = 55;
      } else {
        heightPer = 30;
      }
      if (document.getElementById("scrolling_language")) {
        document.getElementById("scrolling_language").style.height = (originalHeight * heightPer) / 100;
        this.myStyles = {height:(originalHeight * heightPer) / 100 + "px"};
      //  // console.log('[myStyles ]', this.myStyles);

      // NOTE remove emitted

        // eventBus.$emit('languageRotation', function() {
        //   this.myStyles = {height:(originalHeight * heightPer) / 100 + "px"};
        //   document.getElementById("scrolling_language").style.height = (originalHeight * heightPer) / 100;
        // });
      }
    },
  },
  created() {
    eventBus.$on('toggleLanguagePrefRegisterdEvent', this.togglePopupCB);
    if (this.appActive) {
      eventBus.$on('languageRotation', true);
      this.initPopup();
    }
  },
  mounted() {
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
    // var self = this;
    // this.screenRotationSizeChange();
    // window.addEventListener("orientationchange", function() {
    //   self.screenRotationSizeChange();
    // }, false);
  },
  mixins: [altMixins]
}
</script>
