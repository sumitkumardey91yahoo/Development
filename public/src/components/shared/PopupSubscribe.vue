<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p v-if="altMessages">{{altMessages.subscribeNowMessage}}</p>
                    <!-- <button type="button" class="btn grad-btn btn-lg" @click="$router.push({ name: 'subscribe' })">SUBSCRIBE NOW</button> -->
                     <button type="button" class="btn grad-btn btn-lg" @click="storeUrlDetails">SUBSCRIBE NOW</button>
                    <p class="link-under" @click="closePopup" v-if="altMessages">{{altMessages.buttonSkipNowMultiple}}</p>
                </div>
            </div>
            <div class="alt-overlay" @click="closePopup"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'altMessages',
        ]),
    },
    methods: {
        closePopup() {
            // console.log("popupSubscribe | close");
            eventBus.$emit('toggleSubscribePopupEvent', false);

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        storeUrlDetails() {
            // console.log("popupSubscribe|storeUrlDetails|");
            // console.log("popupSubscribe | submit");
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            this.closePopup();
            localStorage.setItem('session_track_link', window.location.href);
            this.$router.push({ name: 'subscribe' });
        },
    }
}
</script>
