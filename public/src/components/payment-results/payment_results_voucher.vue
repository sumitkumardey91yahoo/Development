<template>
    <div class="alt-help">
        <div class="subs-container" v-if="response==true">
            <div class="subscribe-holder">
                <div class="left-holder">
                    <img class="tick-logo" src="/src/assets/tick.svg" />
                </div>
                <div class="right-holder-desc" style="margin: 5%;" v-if="altMessages">
                    <h3 class="woohoo-title">WOOHOO!</h3>
                    <div class="premium-text" v-if="altMessages">{{altMessages.subscriptionSuccessBrowseThroughMessage}}</div>
                </div>
            </div>
            <div class="subs-plan">
                <div class="subs-level">Current Plan</div>
                <div class="subs-value" v-if="orderListArray" >{{orderListArray.productName}}</div>
            </div>
            <div class="subs-plan">
                <div class="subs-level">Start Date</div>
                <div class="subs-value">{{orderListArray.productCreated}}</div>
            </div>
            <div class="subs-plan">
                <div class="subs-level">Expiry Date</div>
                <div class="subs-value">{{orderListArray.productExpired}}</div>
            </div>

            <div class="subs-plan">
                <div class="subs-level">Email</div>
                <div class="subs-value nowRap-email">{{email}}</div>
            </div>
            <div class="subs-plan">
                <div class="subs-level">Order Id</div>
                <div class="subs-value" v-if="orderListArray">{{orderListArray.productId}}</div>
            </div>
            <div class="subs-plan total-border">
                <div class="subs-level">Total</div>
                <div class="subs-value" v-if="orderListArray">{{(orderListArray.productCurrency == 'INR' ? '₹' : '$')}}{{orderListArray.productPrice}}</div>
            </div>

            <div class="subs-plan">
                <button type="button" class="submit-btn grad-btn btn" @click="homeRedirect()">start watching</button>

            </div>
        </div>
        <!-- <alt-modals></alt-modals> -->
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

// import Modals from '../shared/Modals.vue';

export default {
    data(){
        return {
            planPrice: undefined,
            planValidity: undefined,
            tranId: undefined,
            response: undefined,
            price_symbol: undefined,
            product_discount: undefined,
            username: undefined,
            cdate: undefined,
            exdate:undefined,
            product_Order_Id:undefined,
            email:undefined,
            altUser: undefined,
            accountOrders:undefined,
            productCreatedDate:undefined,
            productExpiredDate:undefined,
            paymentModeType:undefined,
            orderListArray : undefined,
        }
    },
    computed: {
        ...mapGetters([
            'paymentResponse',
            'appActive',
            'altMessages',
            'altSubsPageMessages',
        ]),
    },
    watch: {
        appActive() {
          this.toggleLoader(true);
            this.getOrder();
        }
    },
    methods: {
        ...mapMutations([
            'setProductResponse'
        ]),
        ...mapActions([
            'actProductResponse',
            'actGetOrders',
        ]),
        homeRedirect() {
            if (localStorage.getItem('session_track_link')) {
                var currentRedirection=localStorage.getItem('session_track_link');
                window.localStorage.removeItem("session_track_link");
                window.location.replace(currentRedirection);
            } else {
                // var res = localStorage.getItem('currentHostName').split("payment-results");

                // NOTE language filter added by sumit 28.03.2019
                // var altConfig = undefined;
                // if (localStorage.getItem('altConfig')) {
                //   altConfig = JSON.parse(localStorage.getItem('altConfig'));
                // }
                // var languageCounterData = undefined;
                // languageCounterData = localStorage.getItem('languageCounter') ? JSON.parse(localStorage.getItem('languageCounter')) : undefined;
                // if(altConfig && altConfig.regional && altConfig.regional.published) {
                //   if(!languageCounterData || (languageCounterData && !languageCounterData.regSubscribe)) {
                //     eventBus.$emit('toggleLanguagePrefRegisterdEvent',true);
                //     if(document.getElementById('NONE')){
                //       document.getElementById('NONE').checked = true;
                //     }
                //     localStorage.setItem("languageCounter",JSON.stringify({"anonymous":languageCounterData && languageCounterData.anonymous ? true :false ,"regSubscribe":true}));
                //   }
                // }
                // NOTE language filter
                this.$router.push({ name: 'home' });
              //  window.location.replace(location.protocol + '//' + location.host);
            }
        },
        setPaymentHeader() {
            this.setHeaderTitle('');

            var headerSearchIco = document.getElementById('header-search-ico');
            if (headerSearchIco) {
                headerSearchIco.style.display = 'none';
            }

            var recentDeleteIco = document.getElementById('delete-ico');
            if (recentDeleteIco) {
                recentDeleteIco.style.display = 'none';
            }

            var recentCloseDeleteIco = document.getElementById('header-close-ico-default');
            if (recentCloseDeleteIco) {
                recentCloseDeleteIco.style.display = 'none';
            }
        },
        subscriberRedirect() {
            var res = localStorage.getItem('currentHostName').split("payment-results");
            window.location.replace(location.protocol + '//' + location.host + '/subscribe');
        },
        monthDateText(month) {
            var monthArray = new Array();
            monthArray=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
            return monthArray[month];
        },
        getOrder() {
            this.actGetOrders(this.altUser).then((response) => {
                var current_order_id = localStorage.getItem('product_order');

                if(response.orders[0] === undefined || response.orders[0] === null) {
                    //// console.log("undefined----");
                    setTimeout(this.getOrder(),500);
                } else {
                    if(current_order_id != response.orders[0].id) {
                        //// console.log("order not match");
                        setTimeout(this.getOrder(),500);
                    } else {
                        if (response.count && response.orders) {

                          //  this.toggleLoader(false, 'false -> payment_results_voucher -> getOrder');

                            this.response=1;
                            this.accountOrders=response.orders[0];

                            var altGeoData = undefined;
                            if (localStorage.getItem('altGeoData')) {
                                altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
                            }

                            var platformDetails = undefined;
                            try {
                                platformDetails = this.altDetectPlatform();
                            } catch(err) {}

                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                                'event':'gt_purchase',
                                'eventAction':'purchase',
                                'eventCategory':'gt_purchase',
                                'eventLabel':'purchase',
                                'eventValue':1,
                                'gtl_revenue':response.orders[0].price.real_amount,
                                'gtl_currency':response.orders[0].price.currency,
                                'gtl_product_title':response.orders[0].product.titles.en,
                                'gtl_platform':(platformDetails && platformDetails.os) ? platformDetails.os : '' + " " + (platformDetails && platformDetails.osVersion) ? platformDetails.osVersion : '',
                                'gtl_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                                'gtl_country': altGeoData.country && altGeoData.country.iso_code ? altGeoData.country.iso_code : '',
                                'gtl_city': altGeoData.city && altGeoData.city.names && altGeoData.city.names.en ? altGeoData.city.names.en : '',
                                'gtl_device_timestamp':new Date().getTime(),
                                'gtl_payment_mode': localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : '',
                                'gtl_promo_code' : localStorage.getItem('gtaVoucher') ? localStorage.getItem('gtaVoucher') : '',
                            });

                            // NOTE webenage

                            if(webengage) {
                                webengage.track('gt_purchase' , {
                                    'gt_revenue':response.orders[0].price.real_amount ? response.orders[0].price.real_amount : '',
                                    'gt_currency':localStorage.getItem('productCurrency') ? String(localStorage.getItem('productCurrency')) : 'N.A',
                                    'gt_product_title':localStorage.getItem('productTitle') ? String(localStorage.getItem('productTitle')) : 'N.A',
                                    'gt_platform':(platformDetails && platformDetails.os) ? platformDetails.os : '' + " " + (platformDetails && platformDetails.osVersion) ? platformDetails.osVersion : '',
                                    'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                                    'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
                                    'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
                                    'gt_device_timestamp':new Date(),
                                    'gt_payment_mode': localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A',
                                    'gt_promo_code' : localStorage.getItem('gtaVoucher') ? localStorage.getItem('gtaVoucher') : 'N.A'
                                });
                            }

                            // NOTE end webengage

                            this.processOrders(response.orders);
                            var dateObj = new Date(response.orders[0].dates.valid_to.split('+')[0]);
                            var month = dateObj.getUTCMonth(); //months from 1-12
                            var day = dateObj.getUTCDate();
                            var year = dateObj.getUTCFullYear();
                            this.productExpiredDate = day + " " + this.monthDateText(month) + " " + year;
                            var dateObjCreate = new Date(response.orders[0].dates.created.split('+')[0]);
                            var month = dateObjCreate.getUTCMonth(); //months from 1-12
                            var day = dateObjCreate.getUTCDate();
                            var year = dateObjCreate.getUTCFullYear();
                            this.productCreatedDate = day + " " + this.monthDateText(month) + " " + year;

                            // NOTE for the refresh page display whohoo page
                            var orderDataList = undefined;
                            orderDataList = {"productName":response.orders[0].product.titles.en,"productId":response.orders[0].id,"productCurrency":response.orders[0].price.currency,"productPrice":response.orders[0].price.real_amount,"productCreated":this.productCreatedDate,"productExpired":this.productExpiredDate};
                            localStorage.setItem("orderList",JSON.stringify(orderDataList));

                            this.orderListArray = orderDataList;

                            // end

                       this.toggleLoader(false, 'false -> payment_results_voucher -> getOrder');

                        } else {
                            this.toggleLoader(false, 'false -> payment_results_voucher -> getOrder');
                        }
                    }
                }
            }, (error) => {
                // console.log('[payment_result_voucher | getOrder | error | ]', error);
            });
        },
        processOrders(orders) {
            var orderData = new Object();

            var tvodPlans = orders.filter((order) => {
                return order.product.recurring == false;
            });

            // if (tvodPlans && tvodPlans.length) {
            //     var hasActiveTvodPlan = false;
            //     var activeTvodPlanIndex = undefined;
            //     orderData.tvod = {};
            //     orderData.tvod.hasOrder = false;
            //     orderData.tvod.expired = true;
            //
            //     for (var i in tvodPlans) {
            //         var timeDiff = (new Date().getTime() - new Date(tvodPlans[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
            //         if (timeDiff < 0) {
            //             hasActiveTvodPlan = true;
            //             activeTvodPlanIndex = i;
            //             break;
            //         }
            //     }
            //     if (hasActiveTvodPlan) {
            //         orderData.tvod = tvodPlans[activeTvodPlanIndex];
            //         orderData.tvod.hasOrder = true;
            //         orderData.tvod.expired = false;
            //     }
            // } else {
            //     orderData.tvod = false;
            // }
        // NOTE sumit added for multiple tvod
            var multipleTvod = [];
            if (tvodPlans && tvodPlans.length) {
                var hasActiveTvodPlan = false;
                var activeTvodPlanIndex = undefined;
                orderData.tvod = {};
                for (var i in tvodPlans) {
                    var timeDiff = (new Date().getTime() - new Date(tvodPlans[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
                    if (timeDiff < 0) {
                        hasActiveTvodPlan = true;
                        activeTvodPlanIndex = i;
                        tvodPlans[i].expired = false;
                        // console.log("order",tvodPlans[i]);
                        multipleTvod.push(tvodPlans[i]);
                    }
                }
                if (hasActiveTvodPlan) {
                    orderData.tvod = { hasOrder : true, products : multipleTvod };
                } else {
                 orderData.tvod = { hasOrder : false };
                }
            } else {
                   orderData.tvod = { hasOrder : false};
                   // console.log(orderData.tvod);
            }
            //NOTE Sumit added

            var activeSubsOrders = orders.filter((order) => {
                return order.product.recurring == true;
            });
            if (activeSubsOrders && activeSubsOrders.length) {
                var hasActivePlan = false;
                var activePlanIndex = 0;
                orderData.subscription = {};
                orderData.subscription.hasOrder = false;
                orderData.subscription.expired = true;

                for (var i in activeSubsOrders) {
                    var timeDiff = (new Date().getTime() - new Date(activeSubsOrders[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
                    if (timeDiff < 0) {
                        hasActivePlan = true;
                        activePlanIndex = i;
                        break;
                    }
                }
                if (hasActivePlan) {
                    orderData.subscription = activeSubsOrders[activePlanIndex];
                    orderData.subscription.hasOrder = true;
                    orderData.subscription.expired = false;

                    localStorage.setItem('altOrder', JSON.stringify(orderData));

                    // start without refresh change subscrition
                    eventBus.$emit('toggleUserModeChange', true);
                    //End without refresh change subscrition
                } else {
                    localStorage.setItem('altOrder', JSON.stringify(orderData));
                }
            } else {
                localStorage.setItem('altOrder', JSON.stringify(orderData));
            }
            this.toggleLoader(false, 'false -> payment_results_voucher -> getOrder');

            // AWSMA Monetization Event
            setTimeout(() => {
                // AWS Mobile SDK Events
                if (window.mobileAnalyticsClient) {
                  // Product checkout event
                  var checkoutEventAttributeObj = this.getAWSMACommonAttributes();
                  checkoutEventAttributeObj.product_id = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                  checkoutEventAttributeObj.product_title = localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
                  checkoutEventAttributeObj.product_currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                  checkoutEventAttributeObj.order_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                  checkoutEventAttributeObj.product_type = (localStorage.getItem('paymentModeType') && localStorage.getItem('paymentModeType') == 'default') ? 'Subscription' : 'Binge';
                  checkoutEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';

                  window.mobileAnalyticsClient.recordEvent('_product.checkout', checkoutEventAttributeObj, { package_price : localStorage.getItem('product_Price') ? parseInt(localStorage.getItem('product_Price')) : 'N.A' });

                  // ---------------------------------------------------------------------------------------------------

                  var monetizEventAttributeObj = this.getAWSMACommonAttributes();

                  monetizEventAttributeObj.product_id = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                  monetizEventAttributeObj.product_title = localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
                  monetizEventAttributeObj.product_currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                  monetizEventAttributeObj.product_type = 'Subscription';
                  monetizEventAttributeObj.order_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';

                  // monetizEventAttributeObj._currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                  // monetizEventAttributeObj._product_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                  // monetizEventAttributeObj._transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';

                  // NOTE voucher not needed.

                  // monetizEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';
                  monetizEventAttributeObj.monetization_transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';
                  monetizEventAttributeObj.monetization_transaction_store = "Voucher";
                  monetizEventAttributeObj.monetization_transaction_itemid = localStorage.getItem('product_order') ? localStorage.getItem('product_order')  : 'N.A';
                  monetizEventAttributeObj.promo_code = localStorage.getItem('gtaVoucher') ? localStorage.getItem('gtaVoucher')  : 'N.A';
                //  monetizEventAttributeObj.bank_name = "N.A.";

                  // var monetizationDetails = {
                  //   currency : localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency')  : 'N.A',
                  //   productId : localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A',
                  //   quantity : 1,
                  //   price : localStorage.getItem('product_Price') ? localStorage.getItem('product_Price') : 'N.A'
                  // }

                  let currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency')  : 'N.A';
                  let productId = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                  let quantity = 1;
                  let price = localStorage.getItem('product_Price') ? parseInt(localStorage.getItem('product_Price')) : 'N.A';

                  window.mobileAnalyticsClient.recordMonetizationEvent({
                    currency,
                    productId,
                    quantity,
                    price
                  }, monetizEventAttributeObj, {

                  });

                  // window.mobileAnalyticsClient.recordMonetizationEvent(monetizationDetails, monetizEventAttributeObj, { package_price : parseInt(localStorage.getItem('product_Price')) });
                }
                // End of AWS Mobile SDK Events

                localStorage.setItem('productTitle', "");
                localStorage.setItem('productCurrency', "");
                localStorage.setItem('productId', "");
            }, 2000);
            // End of AWSMA Monetization Event
        },
    },
    components: {
        // 'alt-modals': Modals,
    },
    created() {
        this.setPaymentHeader();

        this.altUser = JSON.parse(localStorage.getItem('altUser'));
        this.toggleLoader(true, 'false -> payment_results_voucher -> getOrder');
        this.email = localStorage.getItem('user_email');
        if(localStorage.getItem('orderList')) {
            this.orderListArray = JSON.parse(localStorage.getItem('orderList'));
            // console.log(this.orderListArray);
            this.response = true;
            this.toggleLoader(false);
        } else {
            if (this.appActive) {
                this.getOrder();
            }
        }
    },
    // beforeRouteEnter: (from, to, next) => {
    //   let altOrder = localStorage.getItem('altOrder');

    //   console.log('[subscribe.vue > beforeRouteEnter > altOrder]', altOrder);

    //   if (altOrder) {
    //     altOrder = JSON.parse(localStorage.getItem('altOrder'));
    //     if (altOrder && altOrder.subscription && altOrder.subscription.expired && altOrder.subscription.hasOrder === false) {

    //       console.log('[subscribe.vue > beforeRouteEnter > this.$router]', this.$router);

    //       next();
    //     } else {
    //       next({ name: 'home' });
    //     }
    //   } else {
    //     next();
    //   }
    // },
    mixins: [altMixins]
}
</script>
