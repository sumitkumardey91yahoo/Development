<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <div class="popup-head-ico hundred-cross-icon" @click="closePopup">
                        <img src="../../assets/close.svg" alt="lan-close" style="width: 19px;">
                    </div>
                    <div class="hundredPlus-episode" v-if="episodeList">
                        <div class="hundredPlus-header-title">SELECT EPISODE RANGE</div>
                        <div class="hundredPlus-header-title-season">Season 1</div>
                        <div class="label-border" @click = "allEpisodeData">{{ episodeList.allEpisodesLabel }}</div>
                        <div style="clear: both;"></div>
                        <div class="label-border" @click="recentEpisodeData"> {{ episodeList.recentLabel }}</div>
                        <div style="clear: both;"></div>
                        <div class="episodes-range">
                            <div class="single-episode-range label-border " v-for="i in iteration" :key="i" @click="rangeWiseEpisodeListing(i)">
                                <div class="sub-title-hundred hundred-left "> {{ episodeList.prefix }}</div>
                                <div class="range-info hundred-right"> {{ rangeStartCals(i) }} - {{ rangeEndCals(i) }}</div>
                                <div style="clear: both;"></div>
                            </div>
                        </div>
                    </div>   
                </div>
            </div>
            <div class="alt-overlay" @click="closePopup"></div>
        </div>
    </div>
</template>

<script>
import { altMixins } from '../../mixins';
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
    data() {
        return {
            pageSize: null,
            episodeCount:null,
            limit:0,
            offset:0,
            iteration:0
        }
    },
    computed: {
        ...mapGetters([
            'episodeList',
            'totalEpisodeCount'
        ])
    },
    watch: {
        totalEpisodeCount (val) {
            this.setTotalEpisodeCount(val);
            this.episodeCount = val;
            this.iteration = Math.ceil(this.episodeCount / this.pageSize);
        }
    },
    methods: {
        ...mapMutations([
            'setTotalEpisodeCount'
        ]),
        analyticsEpisodeFilter (action) {
             if (window.mobileAnalyticsClient) {
                let eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.event_action = action;
                window.mobileAnalyticsClient.recordEvent('_popup.select', eventAttributeObj, {});
            }

             if (window.mobileAnalyticsClient) {
                let eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.event_mode = 'episode_filter';
                eventAttributeObj.event_action = 'Close';
                window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
            }
        },
        rangeWiseEpisodeListing (index) {
            let range = this.rangeStartCals(index) + "-" +  this.rangeEndCals(index);

            this.analyticsEpisodeFilter(range);

            let recentPayload = {};
            recentPayload.order = "asc";
            recentPayload.limit = this.limit;
            recentPayload.offset = this.rangeStartCals(index) - 1;

            recentPayload.lazyLoad = false;
            recentPayload.caption = this.episodeList.prefix + ' ' + range;

            eventBus.$emit("eventHundredEpisodeController",recentPayload);
            // changes as method
            
        },
        allEpisodeData () {
            this.analyticsEpisodeFilter(this.episodeList.allEpisodesLabel);
            let recentPayload = {};
            recentPayload.order = "asc";
            recentPayload.limit = this.limit ? this.limit : 10;
            recentPayload.offset = 0;
            recentPayload.lazyLoad = true;
            recentPayload.caption = this.episodeList.allEpisodesLabel;

            eventBus.$emit("eventHundredEpisodeController",recentPayload);
        },
        recentEpisodeData () {
            this.analyticsEpisodeFilter(this.episodeList.recentLabel);

            let recentPayload = {};
            recentPayload.limit = this.episodeList.initialLoad;
            recentPayload.offset = 0;
            recentPayload.lazyLoad = false;
            recentPayload.caption = this.episodeList.recentLabel;

     
            if( this.episodeList.initialLoadFrom == 'end' && this.episodeList.order == 'asc') {
                recentPayload.order = 'asc';
                recentPayload.offset = this.episodeCount  - this.episodeList.initialLoad;;
            } else if( this.episodeList.initialLoadFrom == 'end' && this.episodeList.order == 'desc') {
                recentPayload.order = 'desc';
                recentPayload.offset = 0;
            } else if( this.episodeList.initialLoadFrom == 'start' && this.episodeList.order == 'desc') {
                recentPayload.order = 'desc';
                recentPayload.offset = this.totalEpisodeCount  - this.episodeList.initialLoad;
            } else if( this.episodeList.initialLoadFrom == 'start' && this.episodeList.order == 'asc') {
                recentPayload.order = 'asc';
                recentPayload.offset = 0;
            }

            eventBus.$emit("eventHundredEpisodeController",recentPayload);
        },
        rangeStartCals(index) {
            // need to change.
            if (index == 1) {
            return (index - 1) + "" + 1;
            } else {
                var info = parseInt(this.rangeEndCals(index - 1 )) + 1;
                if (info <= 9) {
                    return '0' + '' + info;
                } else {
                    return info;
                }
                
            }
        },
        rangeEndCals (index) {
            let currentOffset = index * this.pageSize;
            if (this.episodeCount >= (currentOffset)) {
                if(currentOffset <= 9) {
                    return '0' + '' + currentOffset;
                } else {
                    return currentOffset;
                }
            } else {
                return this.episodeCount;
            }
        },
        closePopup () {
             if (window.mobileAnalyticsClient) {
                let eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.event_mode = 'episode_filter';
                eventAttributeObj.event_action = 'Close';
                window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
            }
            eventBus.$emit("closeEisodefeatures",false);
        }
    },
    mounted() {
        this.pageSize = this.episodeList.pageSize;
        this.limit = this.episodeList.pageSize;

       // console.log("hundredEpisode ||mounted");
        if (this.totalEpisodeCount && this.pageSize) {
            this.iteration = Math.ceil(this.totalEpisodeCount / this.pageSize);
            this.episodeCount = this.totalEpisodeCount;
            // console.log("this.iteration",this.iteration);
        }

    },
    created() {
       // console.log("page size",this.totalEpisodeCount);
    },
    mixins: [altMixins]
}
</script>



