<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-rent-now popup-container">
            <div class="popup-box rent-now-box">
                <div class="popup-contain">
                    <img v-if="playerContent" :src="getPopupImage()" alt="">
                    <div class="popup-cont-bg">
                        <p v-if="playerContent && tvodProduct">Get access to {{playerContent.seriesTitle}} at just {{tvodProduct.currency == 'INR' ? '₹' : '$'}}{{tvodProduct.price}}</p>
                        <button type="button" class="btn grad-btn btn-lg" @click="gotoRentNow" v-if="altMessages">{{altMessages.seriesRentLabel}}</button>
                        <p class="link-under" @click="closePopup" v-if="altMessages">{{altMessages.buttonRentLater}}</p>
                    </div>
                </div>
            </div>
            <div class="alt-overlay"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'playerContent',
            'altMessages',
            'tvodProduct',
        ]),
    },
    methods: {
        getPopupImage() {
            return this.playerContent.images.cover;
        },
        gotoRentNow() {
            this.closePopup();
            localStorage.setItem('session_track_link',window.location.href);

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            this.$router.push({ name: 'rent', params: { type: 'show', id: this.playerContent.seriesId } });
        },
        closePopup() {
            // console.log("close");

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            eventBus.$emit('toggleRentNowPopupEvent', false);
        },
    },
    created() {
        if(document.getElementById('alt-app') && document.getElementById('alt-app').style.position !== 'unset') {
          document.getElementById('alt-app').style.position = "fixed";
        }
    },
    destroyed() {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "unset";
        }
    }
}
</script>
