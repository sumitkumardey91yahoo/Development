<template>
    <div>
        <!-- <reset-pass-header></reset-pass-header> -->
        <div class="container">
            <img class="login-logo" src="../../assets/logo_square.svg" alt="logo">
            <div v-if="emailResetted">
                <p class="text-center">Please check your mail. We've sent you a link. Just click on it and set your new password.</p>
                <button type="button" class="btn grad-btn btn-lg" @click="goToHome">HOME</button>
            </div>
            <div v-else>
                <p class="text-center">Please enter your registered email below. We'll send you a link to reset your password.</p>
                <form class="reset-pass-form">
                    <div class="form-group">
                        <input type="email" class="form-control" placeholder="Registered Email Address" v-model="email" id="wage" @keyup="readInput">
                        <p v-show="emailError" class="text-center">{{emailError}}</p>
                    </div>
                    <button type="button" class="btn grad-btn btn-lg" @click="resetPassword">OK</button>
                </form>
            </div>
        </div>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

// const Header = () => import (/* webpackChunkName: "reset-password-ResetPassword-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "reset-password-ResetPassword-Modals" */ '../shared/Modals.vue');

export default {
    data() {
        return {
            email: '',
            emailError: false,
            emailResetted: false,
            showCreateKidsPin: false,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'altMessages'
        ])
    },
    watch: {
        appActive() {
            this.initResetPassword();
        }
    },
    methods: {
        ...mapMutations([

        ]),
        ...mapActions([
        'actSendEmailWithToken',
        ]),
        setResetPasswordHeader() {
            this.setHeaderTitle('RESET PASSWORD');
            this.toggleSearchIco(false);
            this.toggleCloseIco(false);
            this.toggleDeleteIco(false);
        },
        initResetPassword() {
            this.toggleLoader(false);
        },
        readInput(event) {
            if (event.keyCode == 13) {
                // console.log("ResetPassword.vue|readInput");
                document.getElementById("wage").blur();
            }
        },
        resetPassword() {
            // console.log('[ResetPassword | email | ]', this.email);

            if (this.email) {
                if ((/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.email)) {
                    this.emailError = false;
                    this.toggleLoader(true);

                    var emailData = {
                        login: this.email,
                        token_type: 'password',
                        uri: 'https://altbalaji.com/activate/'
                    }
                    this.actSendEmailWithToken(emailData).then(
                    (response) => {
                        // console.log('[ResetPassword | resetPassword | response ]', response);

                        if (response.status && response.status == 'ok') {
                            this.emailResetted = true;
                            this.toggleLoader(false);
                        }
                    },
                    (error) => {
                         // console.log('[ResetPassword | resetPassword | error ]', error);

                        if (error && error.message) {
                            this.toggleAltPopup(true, this.altMessages.accountNotFoundError);
                            this.toggleLoader(false);
                        }
                    }
                    )
                } else {
                    this.emailError = 'Not a valid email address';
                }
            } else {
                this.emailError = 'Enter email address';
            }
        },
        goToHome() {
            this.$router.push({ name: 'home' });
        },
    },
    created() {
        this.toggleLoader(true);

        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;

            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });

        if (this.appActive) {
            this.initResetPassword();
        }

        var elem = document.getElementById("wage");
    },
    mounted() {
        this.setResetPasswordHeader();
    },
    components: {
        // 'reset-pass-header': Header,
        'alt-modals': Modals,
        // 'kids-create-pin': KidsCreatePin,
    },
    beforeRouteEnter: (to, from, next) => {
        var altProfileMode = localStorage.getItem('altProfileMode');
        if (altProfileMode == 'kids') {
            next({ name: 'kidsMode' })
        } else {
            next();
        }
    },
    mixins: [altMixins]
}
</script>
