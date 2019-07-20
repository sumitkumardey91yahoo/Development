<template>
    <div class="alt-help">
        <!-- <help-header></help-header> -->
        <div class="subsc-container" v-if="accountOrders">
            <div class="holder grad-bg">
                <div class="left-holder" style="width: 50%">
                    <h3 v-if="accountOrders.price">{{priceType}}{{accountOrders.price.real_amount}}*</h3>
                    <p class="premium-mnth" style="text-align: left" v-if="accountOrders.product">{{accountOrders.product.titles.en}}</p>
                </div>
                <div class="right-holder" style="width: 50%; height: auto;">
                    <ul class="premium-list-data premium-no-bg" v-show="altConfig && altConfig.subscriptionPage">
                        <li class="premium-list" v-for="item in altConfig.subscriptionPage.features">{{item}}</li>
                    </ul>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="list-table container">
                <div class="table-block">
                    <p v-if="accountOrders.product">Current Plan <span class="plan-title-subscription">{{accountOrders.product.titles.en}}</span></p>
                    <p v-if="accountOrders.dates">Start Date <span>{{productCreatedDate}}</span></p>
                    <p v-if="accountOrders.dates">Expiry Date <span>{{productExpiredDate}}</span></p>
                    <p v-if="altUser">Email <span>{{altUser.login}}</span></p>
                    <p v-if="accountOrders">Order Id <span>{{accountOrders.id}}</span></p>
                </div>
                <p v-if="accountOrders && accountOrders.price">Total <span>{{priceType}}{{accountOrders.price.real_amount}}</span></p>

                <button type="button" class="btn grad-btn btn-sm renewal-button" style="width:100%;" v-if="renewCounter" @click="subscribePage();">Renew</button>

                <button class="signup-btn" type="button" v-show="totalOrderCount > 1" @click="redirectionSetting">VIEW ALL ORDERS</button>
            </div>
        </div>
        <kids-create-pin v-show="showCreateKidsPin"></kids-create-pin>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
const Header = () => import (/* webpackChunkName: "subscribe-Credit-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "subscribe-Credit-Modals" */ '../shared/Modals.vue');
const KidsCreatePin = () => import (/** webpackChunkName: "Home-KidsCreatePin" **/ '../shared/KidsCreatePin.vue');

// import Header from './Header.vue'
// import Modals from '../shared/Modals.vue';
// import KidsCreatePin from '../shared/KidsCreatePin.vue';

import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            altUser: undefined,
            renewCounter:false,
            productCreatedDate:undefined,
            productExpiredDate:undefined,
            showCreateKidsPin: false,
            totalOrderCount:0,
            altConfig:undefined,
            priceType: null
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'accountOrders',
            'altSubsPageMessages',
        ])
    },
    created() {
        this.setSubscriptionHeader();

        this.altUser = JSON.parse(localStorage.getItem('altUser'));

        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;

            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });

        if (this.appActive) {
            this.initSubscription();
        }
        if(localStorage.getItem('altConfig')) {
            this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }
        // console.log("Subscription.vue|alt config",this.altConfig);
    },
    mounted() {
        // GTM Webengage
        this.sendGTMpageViewData('subscription');
    },
    components: {
        'help-header': Header,
        'alt-modals': Modals,
        'kids-create-pin': KidsCreatePin,
    },
    beforeRouteEnter: (to, from, next) => {
        var altProfileMode = localStorage.getItem('altProfileMode');
        if (altProfileMode == 'kids') return;
        if (JSON.parse(localStorage.getItem('altUser'))) {
            next();
        } else {
            next({ name: 'home' });
        }
    },
    watch: {
        appActive() {
            this.initSubscription();
        },
    },
    methods: {
        ...mapMutations([
            'setAccountOrders',
        ]),
        ...mapActions([
            'actGetOrders',
        ]),
        subscribePage() {
            var res = localStorage.getItem('currentHostName');
            window.location.replace(location.protocol + '//' + location.host + '/subscribe');
        },
        redirectionSetting () {
         this.$router.push("settings");
        },
        renewalButtonEnable(Exdate) {
            var today,someday,text;
            today = new Date();
            today.setDate(today.getUTCDate()+9);//before nine days button will come
            someday = new Date(Exdate);
            if (someday <= today) {
                this.renewCounter=true;
            }
        },
        monthDateText(month) {
            var monthArray = new Array();
            monthArray=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
            return monthArray[month];
        },
        stuffCommonAttributes() {
            var localAttributeObj = {}
            var geo_location = localStorage.getItem('geo_location');
            var altConfig = JSON.parse(localStorage.getItem('altConfig'));

            if (geo_location) {
                geo_location = JSON.parse(geo_location);
                localAttributeObj = geo_location;
            }
            localAttributeObj.user_email = localStorage.getItem('user_email');
            localAttributeObj.user_id = localStorage.getItem('account_id');
            localAttributeObj.user_session = localStorage.getItem('token');
            localAttributeObj.user_name = localStorage.getItem('user_name');
            localAttributeObj.user_dob = localStorage.getItem('user_birthday');
            localAttributeObj.user_gender = localStorage.getItem('user_gender');
            localAttributeObj.app_env = altConfig.environment.title;

            return localAttributeObj;
        },
        stuffMenuSelectAttributes( sectionTitle, sectionId) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();

            eventAttributeObj.page_title = sectionTitle;
            eventAttributeObj.section_id = sectionId.toString();

            return eventAttributeObj;
        },
        stuffPageViewAttributes( pageTitle, pageUrl) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();

            eventAttributeObj.page_title = pageTitle;
            eventAttributeObj.page_url = pageUrl;

            return eventAttributeObj;
        },
        countOrders(orders) {

            var tvodPlansCount = orders.filter((order) => {
                return order.product.recurring == false;
            });
            if (tvodPlansCount && tvodPlansCount.length) {
                for (var i in tvodPlansCount) {
                    var timeDiff = (new Date().getTime() - new Date(tvodPlansCount[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
                    if (timeDiff < 0) {
                    this.totalOrderCount=this.totalOrderCount+1;
                    }
                }
            }
            var activeSubsOrdersCount = orders.filter((order) => {
                return order.product.recurring == true;
            });
            if (activeSubsOrdersCount && activeSubsOrdersCount.length) {
                for (var i in activeSubsOrdersCount) {
                    var timeDiff = (new Date().getTime() - new Date(activeSubsOrdersCount[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
                    if (timeDiff < 0) {
                    this.totalOrderCount=this.totalOrderCount +1;
                    }
                }
            }
            // console.log("Subscription.vue|countOrders",this.totalOrderCount);
        },
        initSubscription() {

            var pageTitle = "Subscription";

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                // var menuSelectAttributes = this.getAWSMACommonAttributes();
                // menuSelectAttributes.page_title = pageTitle;
                // menuSelectAttributes.section_id = 'N.A';
                // window.mobileAnalyticsClient.recordEvent('_menu.select', menuSelectAttributes, {});
                //
                // // NOTE: Code commented for AWSMA redefinition
                // // window.mobileAnalyticsClient.recordEvent('_menu.select', this.stuffMenuSelectAttributes(pageTitle, "N.A."), {});
                //
                // var pageSelectAttributes = this.getAWSMACommonAttributes();
                // pageSelectAttributes.page_title = pageTitle;
                // pageSelectAttributes.page_url = window.location.href;
                // window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
                //
                // // NOTE: Code commented for AWSMA redefinition
                // // window.mobileAnalyticsClient.recordEvent('_page.view', this.stuffPageViewAttributes(pageTitle, window.location.href), {});
            }
            // End of AWS Mobile SDK Events

            this.toggleLoader(true);

            this.actGetOrders(this.altUser).then(
                (response) => {
                    // console.log('[Subscription | response | actGetOrders | response | ]', response);

                    if (response.count) {
                        //NOTE added by sumit this for all order button
                        this.countOrders(response.orders);

                        var activeSubsOrders = response.orders.filter((order) => {
                            return order.product.recurring == true;
                        });
                        if (activeSubsOrders && activeSubsOrders.length) {
                            var hasActivePlan = false;
                            var activePlan = undefined;
                            var activePlanIndex = 0;

                            for (var i in activeSubsOrders) {
                                var timeDiff = (new Date().getTime() - new Date(activeSubsOrders[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
                                if (timeDiff < 0) {
                                    hasActivePlan = true;
                                    activePlanIndex = i;
                                    break;
                                }
                            }
                            if (hasActivePlan) {
                                activePlan = activeSubsOrders[activePlanIndex];

                                var dateObj = new Date(activePlan.dates.valid_to.split('+')[0]);
                                var month = dateObj.getUTCMonth(); //months from 1-12
                                var day = dateObj.getUTCDate();
                                var year = dateObj.getUTCFullYear();
                                this.productExpiredDate=day+" "+this.monthDateText(month)+" "+year;
                                var dateObjCreate = new Date(activePlan.dates.valid_from.split('+')[0]);
                                var month = dateObjCreate.getUTCMonth(); //months from 1-12
                                var day = dateObjCreate.getUTCDate();
                                var year = dateObjCreate.getUTCFullYear();
                                this.productCreatedDate=day+" "+this.monthDateText(month)+" "+year;

                                if (response && response.count) {
                                    //NOTE commented by sumit not display renew button here

                                    //this.renewalButtonEnable(activePlan.dates.valid_to.split('+')[0]);
                                    this.setAccountOrders(activePlan);
                                    if (this.accountOrders.price.currency) {
                                           this.priceType = this.accountOrders.price.currency== 'INR' ? '₹' : '$';
                                    } 
                                }
                            }
                        }
                    }

                    this.toggleLoader(false);
                },
                (error) => {
                    // console.log('[Subscription | response | actGetOrders | error | ]', error);
                    this.toggleLoader(false);
                }
            )
        },
        setSubscriptionHeader() {
            this.setHeaderTitle('Subscription');
            this.toggleSearchIco(false);
            this.toggleCloseIco(false);
            this.toggleDeleteIco(false);
        }
    },
    mixins: [altMixins]
}
</script>

<style>
    .plan-title-subscription {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 65%;
        text-align: right;
    }
</style>
