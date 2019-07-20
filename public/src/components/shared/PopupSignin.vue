<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p v-if="altMessages">{{altMessages.requireLoginError}}</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="goToLogin" v-if="altMessages">{{altMessages.buttonSignInMultiple}}</button>
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
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters([
            'altMessages',
        ]),
    },
    methods: {
        ...mapMutations([
            'setRouterFromParam',
        ]),
        closePopup() {
            // console.log('[PopupSignin | closePopup | ]');

            eventBus.$emit('toggleSigninPopupEvent', false);

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        goToLogin() {
            // console.log('[PopupSignin | goToLogin | ]');
            // console.log('[PopupSignin | goToLogin | $route | ]', this.$route);

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            this.closePopup();
            this.setRouterFromParam(this.$route);
            this.$router.push({ name: 'login' });
        }
    },
}
</script>
