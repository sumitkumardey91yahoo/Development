<template>
    <div>
        <div class="container auth-container">
            <img class="login-logo" src="../../assets/logo_square.svg" alt="logo">
            <login-form></login-form>
            <login-misc></login-misc>
        </div>
        <clear-devices-error v-show="showClearDevicesError"></clear-devices-error>
        <clear-devices v-show="showClearDevices"></clear-devices>
        <kids-create-pin v-show="showCreateKidsPin"></kids-create-pin>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { store } from '../../store/store';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const Header = () => import(/* webpackChunkName: "login-Login-Header" */ './Header.vue');
// const loginForm = () => import(/* webpackChunkName: "login-Login-loginForm" */ './LoginForm.vue');
const ClearDevices = () => import(/* webpackChunkName: "login-Login-ClearDevices" */ './ClearDevices.vue');
const PopupClearDeviceError = () => import(/* webpackChunkName: "login-Login-PopupClearDeviceError" */ '../shared/PopupClearDeviceError.vue');
const loginMisc = () => import(/* webpackChunkName: "login-Login-loginMisc" */ './LoginMisc.vue');
const KidsCreatePin = () => import (/* webpackChunkName: "login-Login-KidsCreatePin" */ '../shared/KidsCreatePin.vue');
const Modals = () => import(/* webpackChunkName: "login-Login-Modals" */ '../shared/Modals.vue');

// import Header from './Header.vue';
import loginForm from './LoginForm.vue';

export default {
    data() {
        return {
            showClearDevices: false,
            showCreateKidsPin: false,
            showClearDevicesError: false,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'user',
            'account',
            'routerFromParam',
        ])
    },
    watch: {
        appActive() {
            this.toggleLoader(false)
        }
    },
    created() {
        // console.log('[Login | created | routerFromParam | ]', this.routerFromParam);

        this.setLoginHeader();

        eventBus.$on('closeClearDevicesEvent', () => {
            this.showClearDevices = false;
        });
        eventBus.$on('showClearDevicesEvent', () => {
            this.showClearDevices = true;
        });
        eventBus.$on('toggleClearDeviceErrorEvent', (state) => {
            this.showClearDevicesError = state;
        });
        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            // console.log('[Login | toggleCreateKidsPinEvent | ]');
            // console.log('[Login | toggleCreateKidsPinEvent | state | ]', state);

            this.showCreateKidsPin = state;
            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });

        if (this.appActive) {
            this.toggleLoader(false);
        }
    },
    mounted() {
        // GTM Webengage
        this.sendGTMpageViewData('login');
        this.webEnagePageView('sign in');
    },
    components: {
        'login-header': Header,
        'clear-devices-error': PopupClearDeviceError,
        'clear-devices': ClearDevices,
        'login-form': loginForm,
        'login-misc': loginMisc,
        'kids-create-pin': KidsCreatePin,
        'alt-modals': Modals,
    },
    beforeDestroy() {
        eventBus.$off('toggleClearDeviceErrorEvent');
        eventBus.$off('postDeleteDevicesEvent');
    },
    beforeRouteEnter: (to, from, next) => {
        var altProfileMode = localStorage.getItem('altProfileMode');

        if (altProfileMode == 'kids') {
            next({ name: 'kidsMode' })
        } else {
            if (localStorage.getItem('altUser')) {
                next({ name: 'home' });
            } else {
                next();
            }
        }
    },
    methods: {
        ...mapActions([
            'actGetDeviceList',
            'actDeleteDevice',
        ]),
        setLoginHeader() {
            this.setHeaderTitle('Sign In');
            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
        },
        clearDevices() {
            // console.log('[Login | clearDevices | user | ]', this.user);
            // console.log('[Login | clearDevices | account | ]', this.account);

            this.actGetDeviceList(this.user).then(
                (response) => {
                    // console.log(response);
                    if (response.count) {
                        var deleteError = false;

                        for (var i in response.devices) {
                            var deleteStatus = this.deleteDevice(response.devices[i].id);
                            if (!(deleteStatus)) {
                                deleteError = true;
                            }
                        }
                        /**
                         * if there is no errors in deletion
                         */
                        if (deleteError) {
                            this.toggleClearDevicealert(false);
                        } else {
                            this.toggleClearDevicealert(false);
                            this.$router.push({ name: 'home' })
                        }
                    } else {
                        this.toggleClearDevicealert(false);
                    }
                },
                (err) => {
                    this.toggleClearDevicealert(false);
                    this.$router.push({ name: 'home' })
                }
            )
        },  //  clearDevices ends
        deleteDevice(id) {
            this.actDeleteDevice({
                user: this.user,
                deviceId: id
            }).then(
                (response) => {
                    // console.log('[Login | deleteDevice | actDeleteDevice | response |]', response);

                    if (response.status && response.status == 'ok') {
                        return { status: true };
                    } else {
                        return { status: false }
                    }
                },
                (error) => {
                    // console.log('[Login | deleteDevice | actDeleteDevice | error |]', error);
                    return { status: false };
                }
            )
        }
    },
    mixins: [altMixins]
}
</script>
