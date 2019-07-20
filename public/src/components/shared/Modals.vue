<template>
    <div class="alt-modals">
        <div class="alt-popup dark-bg" id="alt-popup" style="display:none;">
            <div class="alt-popup-box">
                <p id="alt-message"></p>
                <button type="button" class="submit-btn grad-btn btn alt-err-btn" @click="toggleAltPopup(false)">ok</button>
            </div>
        </div>

        <!-- Kids Signin popup -->
        <div class="kids-signin" id="kids-signin" style="display:none;">
            <div class="kids-signin-box">
                <p v-if="altMessages">{{altMessages.kidsModeAnonymousUser}}</p>
                <button type="button" v-if="altMessages" class="btn grad-btn btn-sm" @click="routeToKidsModeCB">{{altMessages.buttonKidsSignInRegister}}</button>
                <p class="link-under" v-if="altMessages" @click="toggleKidsSigninPopup(false)">{{altMessages.buttonSkipNowMultiple}}</p>
            </div>
            <div class="alt-overlay"></div>
        </div>

        <!-- Kids Subscriber popup -->
        <div class="kids-signin" id="kids-subscribe-popup" style="display:none;">
            <div class="kids-signin-box">
                <p class="text-block-top" v-if="altMessages">{{altMessages.kidsModeFreeUser}}</p>
                <button type="button" class="btn grad-btn btn-lg" @click="routeToSubscribeCB" v-if="altMessages">{{altMessages.buttonSubscribeNowMultiple}}</button>
                <p class="link-under text-block-bottom" @click="toggleKidsSubscribePopup(false)" v-if="altMessages">{{altMessages.buttonSkipNowMultiple}}</p>
            </div>
            <div class="alt-overlay"></div>
        </div>

        <!-- Subscrib Popup -->
        <div class="kids-signin" id="subscribe-popup" style="display:none;">
            <div class="kids-signin-box">
                <p class="text-block-top">You don't want your kids to see all the shows! Sign in to enable parental lock.</p>
                <button type="button" class="btn grad-btn btn-sm" @click="$router.push({ name: 'subscribe' })">Subscribe Now</button>
                <p class="link-under text-block-bottom" v-if="altMessages" @click="toggleSubscribePopup(false)">{{altMessages.buttonSkipNowMultiple}}</p>
            </div>
            <div class="alt-overlay"></div>
        </div>

        <!-- kids first pin screen -->
        <div class="pin-screen" id="pin-first-screen" style="display:none;">
            <div class="pin-screen-box">
                <div class="confirm-pin" v-if="firstPinActive">
                    <p>Confirm PIN</p>
                    <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." @keyup="validateConfirmPin($event)" v-model="confirmPin">
                </div>
                <div class="first-pin" v-else>
                    <p>This is your first time. Set PIN to access kids mode</p>
                    <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." @keyup="validateFirstPin($event)" v-model="pin">
                    <p class="pin-error" v-show="pinError">{{pinErrorMessage}}</p>
                </div>
            </div>
            <img src="../../assets/close.svg" class="kids-pin-close" alt="close" @click="toggleFirstPinScreen(false)">
            <div class="alt-dark-overlay"></div>
        </div>

        <!-- exit kids pin screen -->
        <div class="exit-pin-screen alt-popup-bg dark-bg" id="exit-pin-screen" style="display:none;">
            <div class="pin-screen-header">
                <img src="../../assets/close.svg" class="kids-pin-close" alt="close" @click="closeExitKidsPinScreen">
                <div class="clearfix"></div>
            </div>
            <div class="pin-screen-box">
                <p>Please enter 4 digit passcode below to exit</p>
                <p>To reset your password please visit 'My Account' by clicking top right icon on the website</p>
                <div class="pin-control-box">
                    <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." v-model="exitKidsScreenCode" @keyup="exitKidsEvent($event)">
                </div>
                <p v-show="pinError" class="pin-error" v-if="altMessages">{{altMessages.kidsModeIncorrectPin}}</p>
            </div>
        </div>
    </div>
</template>

<script>
// import CryptoJS from 'crypto-js';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            firstPinActive: false,
            pin: '',
            confirmPin: '',
            pinError: undefined,
            pinErrorMessage: '',
            altUser: undefined,
            username: undefined,
            password: undefined,
            exitKidsScreenCode: '',
        }
    },
    computed: {
        ...mapGetters([
            'altKidsUser',
            'passphrase',
            'searchResults',
            'altKidsProfile',
            'altMessages',
        ]),
    },
    methods: {
        ...mapMutations([
            'setUser',
            'setAccount',
            'setSearchResults',
            'setKidsPlayerContent',
        ]),
        ...mapActions([
            'actEditCurrentProfile',
            'actCreateNewProfile',
            'actGetProfileSwitch',
            'actGetKidsProfileSwitch',
            'actGetUserLogin',
            'actGetAccountDetails',
            'actGetDeviceList',
            'actRegisterDevice',
            'actGetOrders',
            'actSearchQuery',
        ]),
        validateFirstPin(event) {
            if (event.target.value.length == 4) {
                this.firstPinActive = true;
            }
        },
        validateConfirmPin(event) {
            if (event.target.value.length == 4) {
                if (event.target.value == this.pin) {
                    var profileData = {
                        pin: this.altKidsUser.pin,
                    }
                    this.actEditCurrentProfile(profileData).then(
                        (response) => {
                            if (response.status && response.status == 'ok') {
                                this.createNewProfile();
                            }
                        },
                        (error) => {
                            if (error.code == 400) {
                                // console.log('[Modals | validateConfirmPin | altKidsUser | ]', this.altKidsUser);
                                this.createNewProfile();
                            }
                        }
                    )
                } else {
                    this.pinErrorMessage = 'Incorrect PIN';
                    this.pinError = true;
                    this.pin = '';
                    this.confirmPin = '';
                    this.firstPinActive = false;
                }
            }
        },
        createNewProfile() {
            // console.log('[Modals | validateConfirmPin | altKidsUser | ]', this.altKidsUser);
            var altUser = JSON.parse(localStorage.getItem('altUser'));
            // console.log('[Modals | createNewProfile | altUser | ]', altUser);
            var profileData = {
                parental_control: 'R',
                password: this.generateRandomId(32),
                type: 'regular',
                username: 'kids' + altUser.email
            }
            this.actCreateNewProfile(profileData).then(
                (response) => {
                    // console.log('[Modals | actCreateNewProfile | response | ]', response);
                    if (response) {
                        this.altUser = {
                            email: response.email,
                            profileId: response.id,
                            parentalControl: response.parental_control,
                            type: response.type,
                            username: response.username,
                            pin: this.pin
                        };
                        this.switchUserProfile();
                    }
                },
                (error) => {
                    // console.log(error);
                }
            )
        },
        switchUserProfile() {
            this.actGetProfileSwitch(this.altUser).then(
                (response) => {
                    if (response) {
                        // console.log(response);
                        // localStorage.
                        // this.$router.push({ name: 'kidsMode' });
                    }
                },
                (error) => {
                    // console.log(error);
                }
            )
        },
        exitKidsEvent(event) {
            // console.log('[Modals | exitKidsEvent | ]');

            this.pinError = false;
            this.pinErrorMessage = undefined;

            if (event.target.value.length == 4) {
                var pin = event.target.value;

                // console.log('[exitKidsEvent | pin | ]', pin);

                this.actGetKidsProfileSwitch(pin).then(
                    (response) => {
                        // console.log('[Kids | checkSwitchUser | actGetProfileSwitch | response | ]', response);

                        if (response.status == 'ok') {
                            var altUser = JSON.parse(localStorage.getItem('altUser'));
                            altUser.sessionToken = response.session_token;
                            altUser.uuid = response.uuid;
                            localStorage.setItem('altProfileMode', 'default');
                            localStorage.setItem('altUser', JSON.stringify(altUser));
                            this.$router.push({ name: 'home' });
                        }
                    },
                    (error) => {
                        // console.log('[Kids | exitKidsEvent | error ]', error);
                        if (error.status == 'error') {
                            this.pinErrorMessage = error.message;
                            this.pinError = true;
                        }
                    }
                );
            }
        },
        closeExitKidsPinScreen() {
            this.pinError = false;
            this.pinErrorMessage = undefined;
            this.exitKidsScreenCode = '';
            this.toggleExitPinScreen(false);
        },
        getLogin() {
            /**
             * show loader
             */
            this.toggleLoader(true);

            /**
             * [Action | actions.js]
             */
            this.actGetUserLogin({
                username: this.username,
                password: this.password
            }).then(
                (response) => {
                    /**
                     * return property with status = ok if success
                     */
                    // console.log('[LoginForm | getLogin | response]', response);

                    var account = response.account;
                    var profile = response.account.profile;
                    // var encryptedPassword = CryptoJS.AES.encrypt(this.password, this.passphrase).toString();

                    // console.log('[LoginForm | getLogin | encryptedPassword]', encryptedPassword);

                    var altUser = {
                        sessionToken: (response.session_token) ? response.session_token : '',
                        dateCreated: (account.date_created) ? account.date_created : '',
                        email: (account.email) ? account.email : '',
                        accountId: (account.id) ? account.id : '',
                        isAdmin: (account.is_admin) ? account.is_admin : '',
                        login: (account.login) ? account.login : '',
                        username: (profile.username) ? profile.username : '',
                        profileId: (profile.id) ? profile.id : '',
                        // password: encryptedPassword,
                    }

                    localStorage.setItem('token', response.session_token);
                    localStorage.setItem('user_email', response.account.email);
                    localStorage.setItem('account_id', response.account.id);
                    /**
                     * temporarily setting to property
                     */
                    this.altUser = altUser;
                    /**
                     * [mutation | mutations.js]
                     */
                    // this.setUser(altUser);
                    /**
                     * API call for account lookup
                     */
                    this.getAccountLookup();
                },
                (error) => {
                    this.toggleAltPopup(true, error.message);
                    this.toggleLoader(false);

                    // NOTE: Code commented
                    // AWS Mobile SDK Events
                    //
                    if (window.mobileAnalyticsClient) {
                        var eventAttributeObj  = {}
                        var geo_location = localStorage.getItem('geo_location');
                        var altConfig = JSON.parse(localStorage.getItem('altConfig'));

                        if (geo_location) {
                            geo_location = JSON.parse(geo_location);
                            eventAttributeObj = geo_location;
                        }
                        eventAttributeObj.user_email = localStorage.getItem('user_email');
                        eventAttributeObj.user_id = localStorage.getItem('account_id');
                        eventAttributeObj.user_session = localStorage.getItem('token');
                        eventAttributeObj.user_name = localStorage.getItem('user_name');
                        eventAttributeObj.user_dob = localStorage.getItem('user_birthday');
                        eventAttributeObj.user_gender = localStorage.getItem('user_gender');
                        eventAttributeObj.app_env = altConfig.environment.title;
                        eventAttributeObj.event_action = 'error';
                        eventAttributeObj.event_message = error.message;
                        eventAttributeObj.event_code = error.code.toString();
                        window.mobileAnalyticsClient.recordEvent( '_user.login', eventAttributeObj, {});

                    }
                    // End of AWS Mobile SDK Events
                }
            )
        },
        getAccountLookup() {
            this.actGetAccountDetails(this.altUser).then(
                (response) => {
                    // console.log('[LoginForm | getAccountLookup | actGetAccountDetails | ]', response);

                    this.altAccount = {
                        dateCreated: this.formatIsoDate(response.date_created),
                        details: response.details,
                        emailVerified: response.email_verified,
                        marketingConcent: response.marketing_consent,
                        phoneNumber: response.phone_number,
                        profile: response.profile,
                    }

                    localStorage.setItem('user_name', response.name + " " + response.surname);
                    localStorage.setItem('user_birthday', (response.details.birthday) ? response.details.birthday : '');
                    localStorage.setItem('user_gender', (response.details.gender) ? response.details.gender : '');

                    // NOTE: Code commented
                    // AWS Mobile SDK Events
                    //
                    if (window.mobileAnalyticsClient) {

                        var eventAttributeObj  = {}
                        var geo_location = localStorage.getItem('geo_location');
                        var altConfig = JSON.parse(localStorage.getItem('altConfig'));

                        if (geo_location) {
                            geo_location = JSON.parse(geo_location);
                            eventAttributeObj = geo_location;
                        }
                        eventAttributeObj.user_email = localStorage.getItem('user_email');
                        eventAttributeObj.user_id = localStorage.getItem('account_id');
                        eventAttributeObj.user_session = localStorage.getItem('token');
                        eventAttributeObj.user_name = localStorage.getItem('user_name');
                        eventAttributeObj.user_dob = localStorage.getItem('user_birthday');
                        eventAttributeObj.user_gender = localStorage.getItem('user_gender');
                        eventAttributeObj.app_env = altConfig.environment.title;
                        eventAttributeObj.event_mode = 'email';
                        window.mobileAnalyticsClient.recordEvent( '_user.login', eventAttributeObj, {});
                    }
                    // End of AWS Mobile SDK Events
                    /**
                     * get the devices for the account
                     */
                    this.getDevice();
                },
                (err) => {
                    // console.log(err);
                }
            )
        },
        getDevice() {
            var altDeviceId = localStorage.getItem('altDeviceId');
            /**
            * if deviceid is not present in localStorage calling the register device api
            * [actions.js]
            */
            if (!(altDeviceId)) {
                /**
                * generating a randon device id and saving to localStorage
                * [mixins.js]
                */
                altDeviceId = this.generateRandomId(32);

                // console.log('[LoginForm | getDevice | New deviceId Generated | ]', altDeviceId);
            }
            /**
            * call to device list api
            * [actions.js]
            */
            this.actGetDeviceList(this.altUser).then(
                (response) => {

                    if (response.count) {
                        var devices = response.devices;

                        // console.log('[LoginForm | actGetDeviceList | devices | ]',devices);

                        var matchedDevice = devices.filter((device) => {
                            return device.uuid == altDeviceId;
                        });

                        if (matchedDevice && matchedDevice.length) {
                            var deviceObj = matchedDevice[0];

                            // console.log('[LoginForm | actGetDeviceList | matchedDevice | ]',deviceObj);
                            /**
                             * save altDevice to localStorage
                             */
                            this.saveDevice(deviceObj);
                            /**
                             * get the order
                             */
                            this.getOrder();
                        } else {
                            /**
                            * if no device matched in the list
                            */
                            this.registerDevice({ user: this.altUser, deviceId: altDeviceId });
                        }
                        /**
                        * get the orders
                        */

                    } else {
                        /**
                        * if device list is empty, register the device
                        */
                        this.registerDevice({ user: this.altUser, deviceId: altDeviceId });
                    }
                },
                (err) => {
                    // console.log(err);
                }
            )
        },
        registerDevice(deviceId) {
            // console.log('[LoginForm | registerDevice | passed deviceId | ]', deviceId);

            this.actRegisterDevice(deviceId).then(
                (response) => {
                    // console.log('[LoginForm | registerDevice | response | ]', response);

                    if (response) {
                        /**
                         * save altDevice to localStorage
                         */
                        this.saveDevice(response);
                        /**
                        * after registering device get the order
                        */
                        this.getOrder();
                    }
                },
                (err) => {
                    // NOTE: HANDLE THE DEVICE REGISTER EXCEPTION HERE
                    if (err) {
                        // console.log('[Device registration error]', err.message);
                        localStorage.removeItem('altDeviceId');
                        localStorage.setItem('altDeviceId', this.generateRandomId(32));
                        this.setUser(this.altUser);
                        this.setAccount(this.altAccount);
                        this.toggleLoader(false);
                        /**
                         * show clear device popup
                         */
                        this.toggleClearDevicealert(true);
                    }
                }
            )
        },
        getOrder() {
            /**
             * [action | actions.js]
             */
            this.actGetOrders(this.altUser).then(
                (response) => {
                    if (response.count && response.orders) {
                        this.processOrders(response.orders[0]);
                    } else {
                        this.toggleLoader(false);
                        localStorage.removeItem('altUser');
                        localStorage.setItem('altProfileMode', 'default');
                        this.$router.push({ name: 'home' });

                        // NOTE: OLD CODE
                        // this.$router.push({ name: 'home' });
                    }
                },
                (err) => {
                    // console.log(err);
                }
            )
        },
        processOrders(order) {
            // console.log(order);
            var domain = (this.domain).toLowerCase();
            var price = order.price;
            var product = order.product;
            var dates = order.dates;
            var altOrder = {
                accountId: (order.account) ? order.account : '',
                orderId: (order.id) ? order.id: '',
                inProcessing: order.in_processing,
                isTrial: order.is_trial,
                paymentType: (order.payment_type) ? order.payment_type : '',
                amount: (price.amount) ? price.amount: '',
                currency: (price.currency) ? price.currency: '',
                domain: (price.domain) ? price.domain: '',
                realAmount: (price.real_amount) ? price.real_amount: '',
                productId: product.id,
                recurring: product.recurring,
                productType: product.type,
                productTitle: product.titles.default,
                hasOrder: true,
            }
            var timeDiff = (new Date().getTime() - new Date(dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
            // console.log('[timeDiff |]', timeDiff);
            altOrder.expired = (timeDiff > 0) ? true : false;

            localStorage.setItem('altOrder', JSON.stringify(altOrder));

            this.toggleLoader(false);

            localStorage.setItem('altProfileMode', 'default');
            this.$router.push({ name: 'home' });


            // if (this.routerToParam) {
            //     // console.log('[LoginForm | processOrders | routerToParam | ]', this.routerToParam);
            //     // if (this.routerToParam.name == 'kidsMode') {
            //     //     localStorage.setItem('altProfileMode', '')
            //     // }
            //     this.$router.push({ name: this.routerToParam.name });
            // } else {
            //     // console.log('[LoginForm | processOrders | routerToParam does not exists | ]');
            //     this.$router.push({ name: 'home' });
            // }
        },
        saveDevice(deviceObj) {
            // console.log('LoginForm | saveDevice | deviceObj | ', deviceObj);

            var altDevice = {
                uuid: deviceObj.uuid,
                appVersion: deviceObj.app_version,
                deviceId: deviceObj.id,
                ipAddress: deviceObj.ip_address,
                name: deviceObj.name,
                type: deviceObj.type,
                userAgent: deviceObj.user_agent,
            }
            /**
            * finally setting everything to localStorage
            */
            // console.log('LoginForm | saveDevice | altUser | ', this.altUser);

            localStorage.setItem('altUser', JSON.stringify(this.altUser));
            localStorage.setItem('altAccount', JSON.stringify(this.altAccount));
            localStorage.setItem('altDevice', JSON.stringify(altDevice));

            // this.setUserLoggedIn(true);
            // this.setUserLoggedIn();
        },
        searchKidsContents(event) {
            // console.log('[Modals | searchKidsContents | event | ]', event.target.value);

            if (event.target.value.length > 2) {
                var query = event.target.value;

                this.actSearchQuery(query).then(
                    (response) => {
                        // console.log('[Modals | searchKidsContents | response | ]', response);

                        if (response && response.count) {
                            var searchResultArr = new Array()
                            for (var i in response.media) {
                                searchResultArr.push(this.parseContents(response.media[i]));
                            }

                            this.setSearchResults(searchResultArr);

                            // console.log('[Search | getSearchResults | searchResults | ]', this.searchResults);
                        } else {
                            this.setSearchResults(undefined);
                        }
                    },
                    (error) => {
                        // console.log('[Modals | searchKidsContents | error | ]', error);
                    }
                )
            } else {
                this.setSearchResults(undefined);
            }
        },
        closeKidsSearch() {
            var kidsSearchInput = document.getElementById('alt-kids-search-input');

            // console.log('[Modals | closeKidsSearch | kidsSearchInput | ]', kidsSearchInput.value);

            if (kidsSearchInput.value.length) {
                kidsSearchInput.value = '';
            } else {
                this.toggleKidsSearch(false);
            }
        },
        playKidsSearchItem(index) {
            // console.log('[Modals | playKidsSearchItem | index ]', index);
            // console.log('[Modals | playKidsSearchItem | selectedItem ]', this.searchResults[index]);

            this.setKidsPlayerContent(this.searchResults[index]);

            var routerObj = {
                name: 'kidsPlayer',
                query: {
                    type: this.searchResults[index].contentType
                }
            };
            if (this.searchResults[index].contentType == 'trailer') {
                routerObj.query.seriesid = this.searchResults[index].contentId;
            } else if (this.searchResults[index].contentType == 'series' || this.searchResults[index].contentType == 'standup') {
                routerObj.query.seriesid = this.searchResults[index].seriesId;
            } else if (this.searchResults[index].contentType == 'movie') {
                routerObj.query.contentid = this.searchResults[index].contentId;
            }

            this.$router.push(routerObj);

        },
        routeToKidsModeCB() {
            var kidsModeSignin = document.getElementById('kids-signin');
            if (kidsModeSignin) {
                kidsModeSignin.style.display = 'none';
            }

            this.$router.push({ name: 'login' });
        },
        routeToSubscribeCB() {
            var kidsModeSubscribe = document.getElementById('kids-subscribe-popup');
            if (kidsModeSubscribe) {
                kidsModeSubscribe.style.display = 'none';
            }

            this.$router.push({ name: 'subscribe' })
        }
    },
    mixins: [altMixins]
}
</script>
