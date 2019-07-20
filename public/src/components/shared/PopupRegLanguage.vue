<template>
  <div class="alt-popup-bg dark-bg popup-reg-language">
    <div class="popup-top-bord"></div>

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

    <div class="container">
      <p class="sec-title">Select/Change preferred regional language</p>

      <div class="language-list" v-if="languages">
        <ul class="list">
          <li v-for="(language, i) in languages" :key="i">
            <label :for="`lang-rdo-${i}`">
              <input
              type="radio"
              v-model="languageSelected"
              :value="language.name"
              :id="`lang-rdo-${i}`">

              {{language.name}}

              <span class="check"></span>
            </label>
          </li>
        </ul>

        <Loading :visibility="showLoading"></Loading>

        <button type="button" class="btn grad-btn btn-lg-language" @click="submitCB">DONE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapActions } from 'vuex';
import Loading from '@/components/shared/Loading.vue';

export default {
  data() {
    return {
      languages: null,
      languageSelected: 'None',
      showLoading: false
    }
  },
  props: [
    'hidepopupEvent'
  ],
  computed: {
    ...mapGetters([
      'altProfiles'
    ])
  },
  components: {
    Loading
  },
  created() {
    // Gets the list of languages from the config > regional > lanugages key
    this.getLanguages();
    // Get preferred language from local storage and set it to the data property to select the current radio button
    this.setPreferredLanguage();
  },
  methods: {
    ...mapActions([
      'actPutProfileDetails',
      'actPostProfileDetails'
    ]),
    getLanguages () {
      if (localStorage.getItem('altConfig')) {
        // Use try catch while using JSON.parse to avoid getting exeptions
        try {
          let altConfig = JSON.parse(localStorage.getItem('altConfig'));

          let languages = altConfig.regional && altConfig.regional.languages;
          // Assign to the data property
          if (languages && languages.length) this.languages = languages;

          // console.log('[getLanguages > this.languages]', this.languages);
        } catch (e) {

        }
      }
    },
    setPreferredLanguage () {
      if (localStorage.getItem('pref_language_data')) {
        let pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));

        if (pref_language_data.language) {
          this.languageSelected = pref_language_data.language;
        } else {
          this.languageSelected = 'None';
        }
      }
    },
    submitCB () {
      // Show the loader by setting the data property 'showLoading' to true which will pass a props to the loading component which makes the opacity of the loader to '1'
      this.showLoading = true;

      let data = { regional_language: this.languageSelected };

      let profileHasLanguage = this.checkProfileHasLanguage();

      this.$emit('languageChanged', this.languageSelected);

      let requestAction;
      if (profileHasLanguage) {
        requestAction = this.actPutProfileDetails(data);
      } else {
        requestAction = this.actPostProfileDetails(data);
      }

      requestAction.then(response => {
        this.showLoading = false;
        this.hidepopupEvent();
      }).catch(error => {
        this.showLoading = false;
        this.hidepopupEvent();
      });

      /**
       * Updating data to local storage
       */
      if (localStorage.getItem('pref_language_data')) {
        let pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));

        let updatedData = {
          ...pref_language_data,
          language: this.languageSelected
        }

        // Again save to local storage, the updated data
        localStorage.setItem('pref_language_data', JSON.stringify(updatedData));
      }
    },
    checkProfileHasLanguage () {
      if (this.altProfiles && this.altProfiles.count) {
        let extra_details = this.altProfiles.profiles[0].extra_details;
        if(extra_details.regional_language || extra_details.regional_language === '') {
          return true;
        }
        return false;
      }
    },
    closePopup () {
      this.hidepopupEvent();
    }
  },
  mixins: [altMixins]
}
</script>

<style lang="css" scoped>
.popup-reg-language {
  overflow-y: scroll;
}
.language-list {
  padding-bottom: 20px;
}
.popup-top-bord {
  height: 5px;
  background-color: #ed3c3d;
}
.language-list .list li {
  display: block;
}
.language-list .list li input[type="radio"] {
  position: absolute;
  visibility: hidden;
}
.language-list .list .check {
  position: absolute;
  width: 22px;
  height: 22px;
  top: 10px;
  left: 0;
  background-color: #484848;
  border-radius: 50%;
  margin: 0;
}
.language-list .list .check::before {
  position: absolute;
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 50%;
  top: 5px;
  left: 5px;
}
.language-list .list li input[type="radio"]:checked ~ .check::before {
  background-color: #d6d6d6;
}
.language-list .list li label {
  font-size: 15px;
  position: relative;
  padding: 12px 15px;
  display: block;
  padding-left: 40px;
}
</style>
