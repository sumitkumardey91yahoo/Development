<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="alt-list-box alt-language-popup" v-if="availLanguages">
                <h4>Select your preferred language</h4>
                <ul class="alt-list">
                    <li>{{currentLanguage}} <span class="li-ico">✔</span></li>
                    <li v-for="(key, lang) in availLanguages" @click="changeLanguage(key, lang)">{{capitalizeFirstLetter(lang)}}</li>
                </ul>
            </div>
            <div class="alt-overlay" @click="closePopup"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from "../../mixins";

export default {
    computed: {
        ...mapGetters([
            'appActive',
            'currentLanguage',
            'availLanguages',
            'playerContent'
        ]),
    },
    methods: {
        closePopup() {
            eventBus.$emit('toggleLanguageFilterEvent', false);

            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();

                eventAttributeObj.event_action = 'close';
                eventAttributeObj.content_id = this.playerContent.id ? this.playerContent.id : 'N.A';
                eventAttributeObj.content_title = this.playerContent.title ? this.playerContent.title.toLowerCase() : 'N.A';
                eventAttributeObj.content_type = this.playerContent.contentType ? this.playerContent.contentType : 'N.A';
                eventAttributeObj.content_streamid = this.playerContent.stream ? this.playerContent.stream.streamId : 'N.A';
                eventAttributeObj.content_url = location.href;
                eventAttributeObj.event_mode = this.currentLanguage;
                eventAttributeObj.event_source = this.$route.name;

                window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
            }
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        changeLanguage(seriesId, lang) {
            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();

                eventAttributeObj.event_mode = lang
                eventAttributeObj.event_source = this.$route.name

                window.mobileAnalyticsClient.recordEvent('_popup.select', eventAttributeObj, {});
            }
            eventBus.$emit('languageChangeEvent', seriesId);
            eventBus.$emit('languageChangeEventForRelatedSeason', seriesId);
        },
        //added sumit make first capital 09.01.2018
        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    },
    mixins: [altMixins],
}
</script>

<style>
.alt-language-popup {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  margin: 0;
}
</style>
