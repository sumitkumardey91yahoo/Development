<template>
    <div class="alt-popup-bg trans-bg">
        <div class="popup-container">
            <div class="alt-overlay" @click="closePopupAnalytics"></div>
            <div class="popup-box more-det-popup">
                <div class="popup-contain">
                    <img id="more-det-img" v-if="infoDetails" :src="getPopupImage()" alt="">
                    <div class="more-det">
                        <h3 class="pldt-sr-title" v-show="infoDetails.seriesTitle">{{infoDetails.seriesTitle}}</h3>
                        <h3 class="trailer-name" v-if="infoDetails.title">{{infoDetails.title}}</h3>
                        <ul class="info-tags">
                            <!-- If the content type is show, then hide the element -->
                            <!-- <li v-if="infoDetails.duration && !infoDetails.noShow">{{infoDetails.duration}}</li> -->
                            <!-- added by sumit comedy section duration not coming-->
                            <li v-if="infoDetails.age_limit">{{infoDetails.age_limit}}</li>
                            <li v-if="infoDetails.categories && infoDetails.categories.length">{{infoDetails.categories.join(', ')}}</li>
                            <li v-if="infoDetails.langListArr && infoDetails.langListArr.length">
                                {{infoDetails.langMsg}}
                            </li>
                            <li v-else-if="infoDetails.mainLanguage">{{infoDetails.mainLanguage}}</li>
                        </ul>
                        <!-- NOTE added by sumit for poster image 0s && hide year -->
                        <h6 class="series-episode" v-if="infoDetails.releaseYear && infoDetails.contentTitle != 'Poster'"><span class="grey">Year of release : </span><span class="description-media">{{infoDetails.releaseYear}}</span></h6>
                        <!-- NOTE sumit change the location of also available the app wise 18.01.2018 -->

                        <h6 class="series-episode" v-if="infoDetails.categoryNames">{{(infoDetails.categoryNames).join(', ')}} | {{infoDetails.mainLanguage}}</h6>
                        <h6 class="series-episode" v-if="infoDetails.cast"><span class="grey">Actors : </span><span class="description-media">{{infoDetails.cast.join(', ')}}</span></h6>
                        <h6 class="series-episode" v-if="infoDetails.director && infoDetails.director.length"><span class="grey">Director : </span><span class="description-media">{{infoDetails.director.join(', ')}}</span></h6><br/>

                        <!-- NOTE added by sumit for extra blank line remove && commented old code 16.01 Issue #121(ALT team) -->
                        <!-- <p v-if="infoDetails.longDescription" v-for="(longDesc, index) in infoDetails.longDescription">{{longDesc}}</p> -->

                        <div v-if="infoDetails.longDescription" v-for="(longDesc, index) in infoDetails.longDescription" :key="index">
                            <h6 v-if="longDesc.length > 1" class="description-media grey">{{longDesc}}</h6>
                            <h6 v-else><br/></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins';

export default {
    data() {
        return {
            silentTrack: '/src/assets/silent-track.mp3',
            plrPosterImage: null,
            infoDetails: null,
        }
    },
    computed: {
        ...mapGetters([
            'playerContent',
            'showTrailerInfo'
        ]),
    },
    methods: {
        getPopupImage() {
            return this.infoDetails.images.cover;
        },
        closePopup() {
            eventBus.$emit('toggleMoreDetailsPopupEvent', false);

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        closePopupAnalytics() {
            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();
                let event_source = (this.$route.name && this.$route.name == 'media') ? 'movie details' : 'show details';

                eventAttributeObj.event_action = 'close';
                eventAttributeObj.content_id = this.playerContent.id ? this.playerContent.id : 'N.A';
                eventAttributeObj.content_title = this.playerContent.title ? this.playerContent.title.toLowerCase() : 'N.A';
                eventAttributeObj.content_type = this.playerContent.contentType ? this.playerContent.contentType : 'N.A';
                eventAttributeObj.content_streamId = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : 'N.A';
                eventAttributeObj.content_url = location.href;
                eventAttributeObj.event_mode = 'more_details';
                eventAttributeObj.event_source = event_source;

                window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
            }
            this.closePopup()
        }
    },
    mounted() {
        if (this.showTrailerInfo && !this.showTrailerInfo.bts) {
            this.infoDetails = this.showTrailerInfo;
        }
        if (this.playerContent && this.playerContent.contentName == 'media' && !this.playerContent.bts) {
            this.infoDetails = this.playerContent;
        }
    },
    created() {
        eventBus.$on('closeMoreDetPopup', this.closePopup);
    },
    mixins: [altMixins],
}
</script>
