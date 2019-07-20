<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p v-if="altMessages && altMessages.contentDoNotExistError">{{altMessages.contentDoNotExistError}}</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="closePopup">back</button>
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
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
            // this.$router.push({ name: 'home' });
            window.history.back();
            //NOTE sumit added 21.03.2018
            eventBus.$emit('toggleCountrywiseVideoBlock', false);
        }
    }
}
</script>
