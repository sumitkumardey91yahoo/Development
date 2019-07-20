<template>
    <div class="alt-favourites">
        <component v-if="activeComponent" :is="activeComponent"></component>

        <popup-activate-invalid-link v-show="showActivateInvalidLink"></popup-activate-invalid-link>
        <popup-activate-pwdrstsucs v-show="showActivatePwdRstSucs"></popup-activate-pwdrstsucs>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const Password = () => import (/* webpackChunkName: "activate-Activate-Password" */ './Password.vue');
const Registration = () => import (/* webpackChunkName: "activate-Activate-Registration" */ './Registration.vue');
const Modals = () => import (/* webpackChunkName: "activate-Activate-Modals" */ '../shared/Modals.vue');
const PopupActivateInvalidLink = () => import (/* webpackChunkName: "activate-Activate-PopupActivateInvalidLink" */ '../shared/PopupActivateInvalidLink.vue');
const PopupActivatePwdRstSucs = () => import (/* webpackChunkName: "activate-Activate-PopupActivatePwdRstSucs" */ '../shared/PopupActivatePwdRstSucs.vue');

// import Header from './Header.vue'
// import Modals from '../shared/Modals.vue';

export default {
    data() {
        return {
            token: undefined,
            activeComponent: undefined,
            showCreateKidsPin: false,
            showActivateInvalidLink: false,
            showActivatePwdRstSucs: false,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
        ]),
    },
    watch: {
        appActive() {
            this.checkToken();
        }
    },
    methods: {
        ...mapActions([
            'actCheckToken',
        ]),
        setActivateHeader() {
            this.setHeaderTitle(false);
            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
        },
        checkToken() {
            // Set the value of the token to the data
            this.token = this.$route.params.token;

            // Fetch the API
            this.actCheckToken(this.token).then((response) => {
                // console.log('[Activate | checkToken | response | ]', response);

                if (response.status == 'ok') {
                    // Set the active component as the value coming from the response.
                    // The component named the response value should
                    this.activeComponent = response['token-type'];

                    // console.log('[Activate | checkToken | activeComponent | ]', this.activeComponent);
                }
            }).catch((error) => {
                // Catch the error
                // console.log('[Activate | checkToken | error | ]', error);

                // Hide the loader
                this.toggleLoader(false);

                // Show the invalid activation link popup
                if (error.code == 404 && error.message == 'Token not found') {
                    this.showActivateInvalidLink = true;
                }
            });
        },
    },
    created() {
        if (this.appActive) {
            this.checkToken();
        }

        eventBus.$on('toggleActivateInvalidLinkPopup', (state) => {
            this.showActivateInvalidLink = state;
        });
        eventBus.$on('toggleActivatePwdRstSucsPopup', (state) => {
            // console.log('toggleActivatePwdRstSucsPopup');

            this.showActivatePwdRstSucs = state;
        });
    },
    mounted() {
        this.toggleLoader(true);

        this.setActivateHeader();
    },
    components: {
        'password': Password,
        'registration': Registration,
        'alt-modals': Modals,
        'popup-activate-invalid-link': PopupActivateInvalidLink,
        'popup-activate-pwdrstsucs': PopupActivatePwdRstSucs,
    },
    beforeDestroy() {
        eventBus.$off('toggleActivateInvalidLinkPopup');
        eventBus.$off('toggleActivatePwdRstSucsPopup');
    },
    mixins: [altMixins]
}
</script>
