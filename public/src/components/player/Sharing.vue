<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-sharing popup-container">
            <div class="popup-header" style="top: 12px;right: 12px;">
                <img src="../../assets/close.svg" class="kids-pin-close ico-cross" alt="close" @click="closeSharing" style="width: 20px;padding: unset;">
            </div>
            <div class="popup-box sharing-box">
                <div class="popup-bg">
                    <ul>
                        <li><img src="../../assets/fb.svg" @click="shareToFacebook"></li>
                        <li><a :href="twitterURL" target="_blank"><img src="../../assets/tw.svg" @click="twitterHidePopup"></a></li>
                    </ul>
                </div>
            </div>
            <div class="alt-overlay"></div>
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
            twitterURL: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'playerContent',
        ]),
    },
    watch: {
        playerContent() {
            if (!this.playerContent) return;

            this.twitterURL ='https://twitter.com/share?url=' + encodeURIComponent(location.href) + '&text=Watch ' + this.playerContent.title + ' on AltBalaji';
        },
        //NOTE added by sumit for hide popup while routing
        $route(to,from) {
       eventBus.$emit('closeSharingEvent');
        }
    },
    methods: {
        closeSharing() {
            // console.log("share close");
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
            eventBus.$emit('closeSharingEvent');
        },
        stuffCommonAttributes() {
            var localAttributeObj = {}
            var geo_location = localStorage.getItem('geo_location');
            var altConfig = JSON.parse(localStorage.getItem('altConfig'));

            if (geo_location) {
                geo_location = JSON.parse(geo_location);
                localAttributeObj = geo_location;
            }
            localAttributeObj.user_email = localStorage.getItem('user_email');
            localAttributeObj.user_id = localStorage.getItem('account_id');
            localAttributeObj.user_session = localStorage.getItem('token');
            localAttributeObj.user_name = localStorage.getItem('user_name');
            localAttributeObj.user_dob = localStorage.getItem('user_birthday');
            localAttributeObj.user_gender = localStorage.getItem('user_gender');
            localAttributeObj.app_env = altConfig.environment.title;

            return localAttributeObj;
        },
        stuffSharingAttributes(shareTarget, shareLink) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();

            // console.log('[Sharing | stuffSharingAttributes | playerContent | ]', this.playerContent);

            eventAttributeObj.content_id = this.playerContent ? this.playerContent.id : 'N.A';
            eventAttributeObj.content_title = this.playerContent ? this.playerContent.title.toLowerCase() : 'N.A';
            eventAttributeObj.content_url = (this.playerContent && this.playerContent.stream) ? this.playerContent.stream.streamUrl : 'N.A';
            eventAttributeObj.content_type = this.playerContent ? this.playerContent.contentType : 'N.A';
            eventAttributeObj.share_target = shareTarget;
            eventAttributeObj.share_link = shareLink;

            return eventAttributeObj;
        },
        shareToFacebook() {
            eventBus.$emit('closeSharingEvent');

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }


            // console.log('[Sharing | shareToFacebook | ]');
            // console.log('[Sharing | shareToFacebook | playerContent ]', this.playerContent);

            var self = this;

            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object: {
                        'og:url': window.location.href,
                        'og:title': 'Watch ' + self.playerContent.title,
                        'og:description': self.playerContent.mediumDescription,
                        'og:image': self.playerContent.images.cover
                    }
                })
            },
            function (response) {
                // Action after response

                // console.log('[shareToFacebook | response | ]', response);
            });

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.content_id = this.playerContent ? this.playerContent.id : 'N.A';
                eventAttributeObj.content_title = this.playerContent ? this.playerContent.title.toLowerCase() : 'N.A';
                eventAttributeObj.content_url = window.location.href;
                eventAttributeObj.content_type = this.playerContent ? this.playerContent.contentType : 'N.A';
                eventAttributeObj.share_target = 'facebook';
                eventAttributeObj.share_link = window.location.href;
                window.mobileAnalyticsClient.recordEvent('_content.share', eventAttributeObj, {});
            }
            // End of AWS Mobile SDK Events
        },
        shareToTwitter() {

            var sharingUrl = 'https://twitter.com/share?url=' + window.location.href + '&text="AltBalaji"';
            var twitterWindow = window.open('https://twitter.com/share?url=' + window.location.href + '&text="AltBalaji"', 'twitter-popup');
        },
        twitterHidePopup() {
            eventBus.$emit('closeSharingEvent');

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.content_id = this.playerContent ? this.playerContent.id : 'N.A';
                eventAttributeObj.content_title = this.playerContent ? this.playerContent.title.toLowerCase() : 'N.A';
                eventAttributeObj.content_url = window.location.href;
                eventAttributeObj.content_type = this.playerContent ? this.playerContent.contentType : 'N.A';
                eventAttributeObj.share_target = 'twitter';
                eventAttributeObj.share_link = window.location.href;

                window.mobileAnalyticsClient.recordEvent('_content.share', eventAttributeObj, {});

                // NOTE: Commented for AWSMA refixing
                // window.mobileAnalyticsClient.recordEvent( '_content.share', this.stuffSharingAttributes('twitter', sharingUrl), {});
            }
            // End of AWS Mobile SDK Events
        },
    },
    mixins: [altMixins]
}
</script>
