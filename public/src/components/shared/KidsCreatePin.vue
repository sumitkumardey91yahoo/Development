<template>
    <div class="create-pin-screen alt-popup-bg dark-bg" id="create-pin-screen">
        <div class="pin-screen-header">
            <img src="../../assets/close.svg" class="kids-pin-close" alt="close" @click="closeScreen">
            <div class="clearfix"></div>
        </div>
        <div class="pin-screen-box">
            <div v-if="showFirstPin">
                <p>This is your first time. Set PIN to access kids mode</p>
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
        };
    },
    computed: {
        ...mapGetters([
            'passphrase',
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
                            // console.log('[KidsCreatePin | validateConfimPin | error | ]', error);

                        }
                    )
                } else {
                    // console.log('[KidsCreatePin | validateConfimPin | invalid | ]');

                    this.pinError = 'Incorrect PIN';
                }
            }
        },
        createKidsProfile() {
            var altUser = JSON.parse(localStorage.getItem('altUser'));
            var altKidsUser = {
                parental_control: 'R',
                password: altUser.login,
                type: 'regular',
                username: 'kids' + altUser.login
            };

            this.actCreateNewProfile(altKidsUser).then(
                (response) => {
                    // console.log('[KidsCreatePin | validateConfimPin | response | ]', response);

                    this.switchProfile(altKidsUser);
                },
                (error) => {
                    // console.log('[KidsCreatePin | validateConfimPin | error | ]', error);

                }
            )
        },
        switchProfile(altKidsUser) {
            var altUser = JSON.parse(localStorage.getItem('altUser'));
            var profileObj = { pin: this.firstPin, profileId: altUser.profileId };

            this.actGetProfileSwitch(profileObj).then(
                (response) => {
                    // console.log('[KidsCreatePin | switchProfile | actGetProfileSwitch | response | ]', response);

                    altKidsUser.email = response.email;
                    altKidsUser.parentalControl = response.parental_control;
                    altKidsUser.sessionToken = response.session_token;
                    altKidsUser.username = response.username;
                    altKidsUser.uuid = response.uuid;

                    localStorage.setItem('altKidsUser', JSON.stringify(altKidsUser));
                    localStorage.setItem('altProfileMode', 'kids');
                    this.$router.push({ name: 'kidsMode' });
                },
                (error) => {
                    // console.log('[KidsCreatePin | switchProfile | actGetProfileSwitch | error | ]', error);

                }
            )
        },
        closeScreen() {
            this.showFirstPin = true,
            this.pinError = false;
            this.firstPin = '';
            this.confirmPin = '';
            eventBus.$emit('toggleCreateKidsPinEvent', false);
        },
    },
    mixins: [altMixins]
}
</script>
