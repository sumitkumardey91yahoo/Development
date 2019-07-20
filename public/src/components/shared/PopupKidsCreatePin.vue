<template>
    <div class="kids-create-pin-screen alt-popup-bg dark-bg" id="kids-create-pin-screen">
        <div class="pin-screen-header">
            <img src="../../assets/close.svg" class="kids-pin-close" alt="close" @click="closeScreen">
            <div class="clearfix"></div>
        </div>
        <div class="pin-screen-box">
            <div v-if="showFirstPin">
                <p v-if="altMessages">{{altMessages.kidsFirstPinMessage}}</p>
                <div class="pin-control-box">
                    <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." @keyup="validateFirstPin" v-model="firstPin">
                </div>
            </div>
            <div v-else>
                <p>CONFIRM PIN</p>
                <div class="pin-control-box">
                    <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." @keyup="validateConfimPin" v-model="confirmPin">
                </div>
            </div>
            <p class="pin-error" v-show="pinError">{{pinError}}</p>
            <p class="pin-error" v-show="invalidError">{{invalidError}}</p>
        </div>
    </div>
</template>

<script>
// import CryptoJS from 'crypto-js';
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            showFirstPin: true,
            firstPin: '',
            confirmPin: '',
            pinError: false,
            invalidError:false,
        };
    },
    computed: {
        ...mapGetters([
            'passphrase',
            'altMessages',
        ])
    },
    methods: {
        ...mapMutations([

        ]),
        ...mapActions([
            'actEditAccount',
            'actCreateNewProfile',
            'actCheckWithAccount',
            'actGetProfileSwitch',
        ]),
        validateFirstPin(event) {
            // console.log('[KidsCreatePin | validateFirstPin | value | ]', event.target.value);

            if (event.target.value.length > 3) {
                this.showFirstPin = false;
            }
        },
        validateConfimPin(event) {
            if (event.target.value.length > 3) {
                if (this.firstPin == this.confirmPin) {
                    // console.log('[KidsCreatePin | validateConfimPin | valid | ]');

                    var altUser = JSON.parse(localStorage.getItem('altUser'));

                    // console.log('[KidsCreatePin | validateConfimPin | altUser | ]', altUser);

                    this.actEditAccount({
                        marketingConsent: false,
                        pin: this.firstPin,
                        details: {},
                        Account_Id: altUser.accountId,
                        Profile_Id: altUser.profileId
                    }).then(
                        (response) => {
                            // console.log('[KidsCreatePin | validateConfimPin | response | ]', response);

                            if (response.status && response.status == 'ok') {
                                this.createKidsProfile();
                            }
                        },
                        (error) => {
                            // NOTE added by sumit for Invalid characters 15.01.2018
                            // console.log('[KidsCreatePin | validateConfimPin | error | ]', error.message);
                             this.invalidError = error.message;
                             this.pinError = false;

                        }
                    )
                } else {
                    // console.log('[KidsCreatePin | validateConfimPin | invalid | ]');

                    this.pinError = 'Incorrect PIN';
                    this.invalidError =false;
                }
            }
        },
        createKidsProfile() {
            var altUser = undefined;
            if (localStorage.getItem('altUser')) {
                altUser = JSON.parse(localStorage.getItem('altUser'));
            }

            var altKidsProfile = {
                parental_control: 'R',
                password: altUser.login,
                type: 'regular',
                username: 'kids' + altUser.login
            };

            this.actCreateNewProfile(altKidsProfile).then((response) => {
                // console.log('[KidsCreatePin | validateConfimPin | response | ]', response);

                altUser.profileId = response.id;
                altUser.username = response.username;

                localStorage.setItem('altUser', JSON.stringify(altUser));

                this.switchProfile();
            }, (error) => {
                // console.log('[KidsCreatePin | validateConfimPin | error | ]', error);

            });
        },
        switchProfile(altKidsUser) {
            var altUser = undefined;
            if (localStorage.getItem('altUser')) {
                altUser = JSON.parse(localStorage.getItem('altUser'));
            }

            var profileObj = { pin: this.firstPin, id: altUser.profileId };

            this.actGetProfileSwitch(profileObj).then((response) => {
                // console.log('[KidsCreatePin | switchProfile | actGetProfileSwitch | response | ]', response);

                altUser.sessionToken = response.session_token;
                altUser.uuid = response.uuid;

                localStorage.setItem('altKidsUser', JSON.stringify(altKidsUser));
                localStorage.setItem('altProfileMode', 'kids');
                this.$router.push({ name: 'kidsMode' });

                localStorage.setItem('altUser', JSON.stringify(altUser));

                eventBus.$emit('toggleAppModeChangeEvent', 'kids');
                this.$router.push({ name: 'home' });

                this.closeScreen();
            }, (error) => {
                // console.log('[KidsCreatePin | switchProfile | actGetProfileSwitch | error | ]', error);

            });
        },
        closeScreen() {
            this.showFirstPin = true,
            this.pinError = false;
            this.firstPin = '';
            this.confirmPin = '';
            eventBus.$emit('togglePopupKidsCreatePin', false);
            this.invalidError = false;

            this.$router.push({ name: 'home' });
        },
    },
    mixins: [altMixins]
}
</script>
