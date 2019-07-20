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
            eventBus.$emit('togglePlayerFavSigninPopupEvent', false);
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        goToLogin() {
            // console.log('[PopupSignin | goToLogin | ]');
            // console.log('[PopupSignin | goToLogin | $route | ]', this.$route);

            this.closePopup();

            var routeObj = {
                fullPath: this.$route.fullPath,
                name: this.$route.name,
                params: this.$route.params,
                path: this.$route.path,
                query: this.$route.query,
                extra: {
                    name: 'player-favourite'
                }
            };

            // console.log('[PopupSignin | goToLogin | routeObj | ]', routeObj);
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            this.setRouterFromParam(routeObj);
            this.$router.push({ name: 'login' });
        }
    },
}
</script>
