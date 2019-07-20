<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p>Please sign in to continue.</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="goToLogin">SIGN IN</button>
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
        ...mapMutations([
            'setRouterFromParam',
        ]),
        closePopup() {
            // console.log("close the player app");
            eventBus.$emit('togglePlayerSigninPopupEvent', false);

            // NOTE added by sumit for the popup position chnage 16.12.2018

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        goToLogin() {
            // console.log('[PopupSignin | goToLogin | ]');
            // console.log('[PopupSignin | goToLogin | $route | ]', this.$route);

            // Close the popup
            this.closePopup();
            // Assign value to getter
            // To be used in post login callback
            var routeObj = {
                fullPath: this.$route.fullPath,
                name: this.$route.name,
                params: this.$route.params,
                path: this.$route.path,
                query: this.$route.query,
                extra: {
                    name: 'player'
                }
            };

            // console.log('[PopupSignin | goToLogin | routeObj | ]', routeObj);

            // NOTE added by sumit for the popup position chnage 16.12.2018
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
            this.setRouterFromParam(routeObj);
            this.$router.push({ name: 'login' });
        }
    },
}
</script>
