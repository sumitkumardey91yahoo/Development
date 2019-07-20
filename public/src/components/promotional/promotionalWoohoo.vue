
<template>
    <div class="alt-help">
        <div class="subs-container" v-if="response==true">
            <div style="min-height: calc(100vh - 30vh);overflow: auto;">
                <div class="paytm-subscribe-holder">
                    <div class="left-holder">
                        <img class="paytm-tick-logo" src="/src/assets/tick.svg" />
                    </div>
                    <div class="paytm-right-holder-desc" v-if="altMessages">
                        <h3 class="paytm-woohoo-title">WOOHOO!</h3>
                        <div class="premium-text" style="font-size: 16px;" v-if="partnerDetails &&partnerDetails.woohooSuccessMessage">{{partnerDetails.woohooSuccessMessage}}</div>
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
                    <div class="subs-level">Email ID</div>
                    <div class="subs-value nowRap-email">{{email}}</div>
                </div>
                <div class="subs-plan">
                    <div class="subs-level">Order ID</div>
                    <div class="subs-value" v-if="orderListArray">{{orderListArray.productId}}</div>
                </div>
          </div>
          <pop-up-forgotpassword v-if="isActiveForgotPasword"></pop-up-forgotpassword>

            <div class=""  style="margin-bottom: 60px;" id="woohooButton" >
                <button type="button" v-if="partnerDetails && partnerDetails.continueWatchingButtonText" style="font-size:18px;width: 90%;margin-left: 20px;" class="submit-btn grad-btn btn" @click="homeRedirect()">{{partnerDetails.continueWatchingButtonText}}</button>

                <p v-if="partnerDetails &&  partnerDetails.downloadButtonUrl && partnerDetails.downloadButtonText" style="text-decoration: underline;color: white;text-align: center;" @click="downloadRedirection()">{{partnerDetails.downloadButtonText}}</p>

                <p v-if="partnerDetails && partnerDetails.setPasswordText" style="text-decoration: underline;color: white;text-align: center;font-size: 12px;padding-top: 12px;" @click="sendResetEmailPassword()">{{partnerDetails.setPasswordText}}</p>
            </div>


        </div>
        <!-- If Transaction Fails -->
        <div class="subs-container" v-if="response==false">
            <div class="subs-container">
                <div class="paytm-subscribe-holder">
                    

                    <div  style="    vertical-align: top;height: 100%;overflow: auto;text-align: center;display: block;padding: 40px;">
                        <div class="premium-text" syle="padding-top:20px;">{{partnerDetails.paymentFailedMessage}}</div>
                    </div>
                </div>
            </div>
            <div class = "paytm-subs-container">
                <div>
                    <img src="/src/assets/failure-block.svg" class="paytm-failour-page-logo"/>
                    <h4 v-if="partnerDetails && partnerDetails.paymentFailedMessage" style=" text-align: center;">{{partnerDetails.paymentFailedMessage}}</h4>
                </div>
            </div>

            <div class="subs-plan">
                <button type="button" class="submit-btn signup-btn " @click="paymentFailRedirection()" v-if="altMessages && altMessages.buttonContactSupport">{{altMessages.buttonContactSupport}}</button>
            </div>
            <a href="" id="paytmFailAgainRedirction"></a>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
 import  { syndication } from '../../store/syndication'; 

console.log("syndication", syndication)
import { mapGetters, mapMutations, mapActions } from 'vuex';
const forgotPassword = () => import(/* webpackChunkName: "forgot-password-component" */ '../shared/popupForgotPassword.vue');
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
            setCounter: undefined,
            partnerDetails: undefined,
            isActiveForgotPasword: undefined,
            welcomeEmailObject: {}
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
        
              if (localStorage.getItem('orderList')) {
                   this.partnerDetailsFromConfig();
                    this.orderListArray = JSON.parse(localStorage.getItem('orderList'));
                    this.response = true;
                } else {
                    this.toggleLoader(true);
                    this.initPaymentResult();
                }
        }
    },
    methods: {
        ...mapMutations([
            'setProductResponse'
        ]),
        ...mapActions([
            'actProductResponse',
            'actGetOrders',
            'actCreateOrder',
            'actSendEmailWithToken',
            'actProductDetails'
        ]),
         sendResetEmailPassword() {
             let email = localStorage.getItem('altUser') ? JSON.parse(localStorage.getItem('altUser')).login: null;
             if (!email) return;
            var emailData = {
                login: email,
                token_type: 'password',
                uri: 'https://altbalaji.com/activate/'
            }
            this.actSendEmailWithToken(emailData).then((response) => {
                    if (response.status && response.status == 'ok') {
                    }
                }, (error) => {
                    if (error && error.message) {
                        console.log('[paytmCampaignWoohoo | resetPassword | error ]', error);
                    }
                }
            )
        },
        orderDetails() {
                this.actProductDetails().then((response) => {
                    console.log("paytmCampaignLogin | actProductDetails",response);
                    let price = response.price.real_amount;
                    let productId = response.product.id;
                    let productTitle = response.product.titles.default
                    let productCurrency = response.price.currency;
                    let product_order = response.id;
                    let product_validation = response.product.titles.en;
                    let product_title = response.product.titles.en;

                    let price_symbol = (productCurrency == 'INR') ? '₹' : '$';

                    localStorage.setItem("product_Price",price);
                    localStorage.setItem("productId",productId);
                    localStorage.setItem("productTitle",productTitle);
                    localStorage.setItem("productCurrency",productCurrency);
                    localStorage.setItem("product_order",product_order);
                    localStorage.setItem("product_validation",product_validation);
                    localStorage.setItem("product-title",product_title);
                    localStorage.setItem('price_symbol',price_symbol);

                    
                     this.getOrder();
        
            }, (error) => {

            });
        },
        downloadRedirection() {
                if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.event_mode = 'DOWNLOAD NOW';
                window.mobileAnalyticsClient.recordEvent('_popup.select', eventAttributeObj, {});
                // for immediate firing. 
                window.mobileAnalyticsClient.submitEvents();

                }
                if (this.partnerDetails.downloadButtonUrl) {

                window.location.replace(this.partnerDetails.downloadButtonUrl);
                // console.log("check",this.partnerDetails.redirect_url);
                } 
            },
        paymentFailRedirection() {
                this.toggleMenuIco(true);
                // this.$router.push({ name: 'paymentPage' });
                this.$router.push({ name: 'help' });

            },
          homeRedirect() {
                // this.toggleDeleteIco(true);
                // this.toggleMenuIco(true);

                  if (window.mobileAnalyticsClient) {
                    var eventAttributeObj = this.getAWSMACommonAttributes();
                    eventAttributeObj.event_mode = 'Start Watching';
                    window.mobileAnalyticsClient.recordEvent('_popup.select', eventAttributeObj, {});

                    // for immediate firing. 
                    window.mobileAnalyticsClient.submitEvents();
                  }
                  if(this.partnerDetails.continueWatchingButtonUrl) {

                    window.location.replace(this.partnerDetails.continueWatchingButtonUrl);
                    // console.log("check",this.partnerDetails.redirect_url);
                  } else {
                    window.location.replace(location.protocol + '//' + location.host);
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
            let _this = this;
            this.actGetOrders(this.altUser).then((response) => {
                var current_order_id = localStorage.getItem('product_order');

                if(response.orders[0] === undefined || response.orders[0] === null) {
                    //// console.log("undefined----");
                    this.setCounter++;
                    if (this.setCounter < 6) {
                        setTimeout(() => {
                              _this.getOrder()
                        }, 500);
                    } else {
                        this.response = 0;
                    }
                    
                } else {
                    if(current_order_id != response.orders[0].id) {
                        //// console.log("order not match");
                        this.setCounter++;
                        if (this.setCounter < 6) {
                          setTimeout(() => {
                              _this.getOrder()
                              }, 500);
                            } else {
                                this.response = 0;
                            }
                    
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
                                'gtl_promo_code' :  localStorage.getItem('promotional-voucher') ? localStorage.getItem('promotional-voucher')  : 'N.A'
                            });

                            // NOTE webenage


                            // NOTE end webengage

                            this.processOrders(response.orders);
                            var dateObj = new Date(response.orders[0].dates.valid_to.split('+')[0]);
                            var month = dateObj.getUTCMonth(); //months from 1-12
                            var day = dateObj.getUTCDate();
                            var year = dateObj.getUTCFullYear();
                            this.productExpiredDate = day + " " + this.monthDateText(month) + " " + year;
                            var dateObjCreate = new Date(response.orders[0].dates.valid_from.split('+')[0]);
                            var month = dateObjCreate.getUTCMonth(); //months from 1-12
                            var day = dateObjCreate.getUTCDate();
                            var year = dateObjCreate.getUTCFullYear();
                            this.productCreatedDate = day + " " + this.monthDateText(month) + " " + year;

                            this.sendWelcomeEmail(response.orders[0].dates);

                            // NOTE for the refresh page display whohoo page
                            var orderDataList = undefined;
                            orderDataList = {"productName":response.orders[0].product.titles.en,"productId":response.orders[0].id,"productCurrency":response.orders[0].price.currency,"productPrice":response.orders[0].price.real_amount,"productCreated":this.productCreatedDate,"productExpired":this.productExpiredDate};
                            localStorage.setItem("orderList",JSON.stringify(orderDataList));

                            this.orderListArray = orderDataList;



                            // start with webenage
                                
                            if(webengage) {
                                webengage.track('gt_purchase' , {
                                    'gt_revenue':response.orders[0].price.real_amount ? response.orders[0].price.real_amount : '0.00',
                                    'gt_currency':localStorage.getItem('productCurrency') ? String(localStorage.getItem('productCurrency')) : 'N.A',
                                    'gt_product_title':localStorage.getItem('productTitle') ? String(localStorage.getItem('productTitle')) : 'N.A',
                                    'gt_platform':(platformDetails && platformDetails.os) ? platformDetails.os : '' + " " + (platformDetails && platformDetails.osVersion) ? platformDetails.osVersion : '',
                                    'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                                    'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
                                    'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
                                    'gt_device_timestamp':new Date(),
                                    'gt_payment_mode': localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A',
                                    'gt_promo_code' : localStorage.getItem('promotional-voucher') ? localStorage.getItem('promotional-voucher') : 'N.A',
                                    'gt_start_date':  this.productCreatedDate ?  this.productCreatedDate : 'N.A',
                                    'gt_expiry_date': this.productExpiredDate ? this.productExpiredDate : 'N.A',
                                    'gt_order_id': localStorage.getItem('product_order') ? parseInt(localStorage.getItem('product_order')): 'N.A',
                                    'pack id': localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A',
                                    'partner_id': localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : "N.A",
                                });

                                // console only---------
                                   console.log( 'gt_purchase' , {
                                    'gt_revenue':response.orders[0].price.real_amount ? response.orders[0].price.real_amount : '0.00',
                                    'gt_currency':localStorage.getItem('productCurrency') ? String(localStorage.getItem('productCurrency')) : 'N.A',
                                    'gt_product_title':localStorage.getItem('productTitle') ? String(localStorage.getItem('productTitle')) : 'N.A',
                                    'gt_platform':(platformDetails && platformDetails.os) ? platformDetails.os : '' + " " + (platformDetails && platformDetails.osVersion) ? platformDetails.osVersion : '',
                                    'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                                    'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
                                    'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
                                    'gt_device_timestamp':new Date(),
                                    'gt_payment_mode': localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A',
                                    'gt_promo_code' : localStorage.getItem('promotional-voucher') ? localStorage.getItem('promotional-voucher') : 'N.A',
                                      'gt_start_date':  this.productCreatedDate ?  this.productCreatedDate : 'N.A',
                                    'gt_expiry_date': this.productExpiredDate ? this.productExpiredDate : 'N.A',
                                    'gt_order_id': localStorage.getItem('product_order') ? parseInt(localStorage.getItem('product_order')) : 'N.A',
                                    'pack id': localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A',
                                     'partner_id': localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : "N.A",
                                });
                                // end console only ----------- 
                            }

                            // end with webenage

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
            var _this = this;
            
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
                  checkoutEventAttributeObj.product_type = 'Subscription'  ;
                  checkoutEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';

                   window.mobileAnalyticsClient.recordEvent('_product.checkout', checkoutEventAttributeObj,{});

                   // for immediate firing. 
                    window.mobileAnalyticsClient.submitEvents();

                  // ---------------------------------------------------------------------------------------------------

                  var monetizEventAttributeObj = this.getAWSMACommonAttributes();

                  monetizEventAttributeObj.product_id = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                  monetizEventAttributeObj.product_title = localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
                  monetizEventAttributeObj.product_currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                  // monetizEventAttributeObj.product_type = 'Subscription';
                  monetizEventAttributeObj.order_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';

                   monetizEventAttributeObj._currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                   
                  // monetizEventAttributeObj._product_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                  // monetizEventAttributeObj._transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';

                  // NOTE voucher not needed.

                  // monetizEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';
                  
                 // monetizEventAttributeObj.monetization_transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';
                  monetizEventAttributeObj.monetization_transaction_store = "Voucher";
                  monetizEventAttributeObj.monetization_transaction_itemid = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                  monetizEventAttributeObj.promo_code = localStorage.getItem('promotional-voucher') ? localStorage.getItem('promotional-voucher')  : 'N.A';
                //  monetizEventAttributeObj.bank_name = "N.A.";
                monetizEventAttributeObj.partner_id = localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : "N.A";
                monetizEventAttributeObj.monetization_transaction_price_currency_symbol =  localStorage.getItem('price_symbol') ? localStorage.getItem('price_symbol') : 'N.A';
                monetizEventAttributeObj.monetization_transaction_price_reported =   localStorage.getItem("product_Price")  ? localStorage.getItem("product_Price") : 'N.A';



            
                  let currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency')  : 'N.A';
                  let productId = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                  let quantity = 1;
                  let price = localStorage.getItem('product_Price') ? parseInt(localStorage.getItem('product_Price')) : 'N.A';

                  if (price == 0 || !price) {
                      price = 1;
                  }

                  window.mobileAnalyticsClient.recordMonetizationEvent({
                    currency,
                    productId,
                    quantity,
                    price
                  }, monetizEventAttributeObj, {

                  });

                  // for immediate firing. 
                    window.mobileAnalyticsClient.submitEvents();

                  // window.mobileAnalyticsClient.recordMonetizationEvent(monetizationDetails, monetizEventAttributeObj, { package_price : parseInt(localStorage.getItem('product_Price')) });
                }
                // End of AWS Mobile SDK Events

                localStorage.setItem('productTitle', "");
                localStorage.setItem('productCurrency', "");
                localStorage.setItem('productId', "");

                _this.pageViewWebenage("campaign-woohoo");

                 _this.pageViewEvent("campaign-woohoo");
            }, 2000);
            // End of AWSMA Monetization Event
        },
        partnerDetailsFromConfig() {

            let selectedPromotional =  localStorage.getItem("selectedPromotional") ? JSON.parse(localStorage.getItem("selectedPromotional")) : false;
             this.partnerDetails = selectedPromotional;
             console.log("this.partnerDetails ", this.partnerDetails );
        },
         gatewayFilter(partners) {
                let data = partners.filter(function(partner) {
                    return partner.enabled == "true";
                });
            return data;
         },
        promotionOrderCreation() {
        
            let homeDomain = localStorage.getItem('homeDomain');
            let productId = '';
            console.log("homeDomain", homeDomain);
            console.log("this.partnerDetails", this.partnerDetails);
             if (homeDomain == 'row') {
                productId =  this.partnerDetails.productId.ROW;
             } else {
                 productId = this.partnerDetails.productId.IN;
             }
           let voucherCode = localStorage.getItem("promotional-voucher");

           

            let orderPayload = {
                "product": productId,
                "pricesheet_id": 9,
                "platform": "web",
                "payment_type": "payment_proxy",
                "promo_code": voucherCode
            }

            localStorage.setItem("productId", productId);
            let altOrder = localStorage.getItem('altOrder') ? JSON.parse(localStorage.getItem('altOrder')) : undefined;

             if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                  let valid_to = new Date((altOrder.subscription.dates.valid_to).split('+')[0]).getTime() / 1000;
                orderPayload.date_valid_from = valid_to;
                orderPayload.parent_order_id = altOrder.subscription.id;
             }
           
            this.actCreateOrder(orderPayload).then((response) => {
               localStorage.setItem('product_order', response.id);
           
              this.orderDetails();
                
            }, (error) => {
                this.toggleLoader(false);
                this.response = false;
            
                if( localStorage.getItem('ixigo-pin')) {
                    this.sendResetEmailPassword();
                    localStorage.removeItem('ixigo-pin')
                }
                
                this.failPaymentForVoucher();
                console.log("error", error);

            });
        },
         pageViewWebenage(title) {
            let pageViewData = {};
            pageViewData = {
                'gt_page_title' : title
            };

            if (webengage) {
                webengage.track('gt_page_view' ,pageViewData);
                console.log('gt_page_view' ,pageViewData)
            }
        },
        sendWelcomeEmail(dates) {
            // welcome Email
            let welcomePayload = {};
            let altUser = localStorage.getItem('altUser') ? JSON.parse( localStorage.getItem('altUser')) : null;
            welcomePayload.account_id = altUser && altUser.accountId ? parseInt(altUser.accountId) : 12345;
            welcomePayload.email_id = altUser && altUser.login ? altUser.login : 'N.A';


            welcomePayload.order_id = localStorage.getItem('product_order') ? parseInt(localStorage.getItem('product_order')) : 'N.A';
            welcomePayload.pack_name =  localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
            welcomePayload.pack_id =  localStorage.getItem('productId') ? parseInt(localStorage.getItem('productId')) : 'N.A';
            welcomePayload.pack_currency =  localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';

            welcomePayload.promo_code = localStorage.getItem('promotional-voucher') ? localStorage.getItem('promotional-voucher')  : 'N.A';
            welcomePayload.pack_value =   localStorage.getItem('product_Price') ? parseInt(localStorage.getItem('product_Price')) : 'N.A';

            let valid_from_obj = new Date(dates.valid_from.split('+')[0]);
            welcomePayload.start_date =  valid_from_obj.getUTCDate() + "/" + this.monthDateText(valid_from_obj.getUTCMonth()) + "/" +  valid_from_obj.getUTCFullYear();

            let valid_to_obj = new Date(dates.valid_to.split('+')[0]);
            welcomePayload.end_date =  valid_to_obj.getUTCDate() + "/" + this.monthDateText(valid_to_obj.getUTCMonth()) + "/" +  valid_to_obj.getUTCFullYear();

            let created_obj = new Date(dates.created.split('+')[0]);
            welcomePayload.invoice_date =  created_obj.getUTCDate() + "/" + this.monthDateText(created_obj.getUTCMonth()) + "/" +  created_obj.getUTCFullYear();

           console.log("welcomePayload", welcomePayload)

           syndication.actSendWelcomeEmailCampaign(welcomePayload).then((response) => {

                if ( localStorage.getItem('ixigo-pin')) {
                    this.sendResetEmailPassword();
                    localStorage.removeItem('ixigo-pin')
                }
              
           }, (error) => {

           })

        },
        failPaymentForVoucher() {
              let _this = this;
              this.response = false;
                    setTimeout(() => {
                        // AWS Mobile SDK Events
                        if (window.mobileAnalyticsClient) {
                            var monetizEventAttributeObj = this.getAWSMACommonAttributes();
                            monetizEventAttributeObj.product_id = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                            monetizEventAttributeObj.product_title = localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
                           //  monetizEventAttributeObj.product_currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                          //  monetizEventAttributeObj.product_type = (localStorage.getItem('paymentModeType') && localStorage.getItem('paymentModeType') == 'default') ? 'Subscription' : 'Binge';
                            monetizEventAttributeObj.order_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                            // monetizEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';
                           // monetizEventAttributeObj.monetization_transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';
                            monetizEventAttributeObj.monetization_transaction_store = "Voucher";

                            monetizEventAttributeObj.monetization_transaction_itemid = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                             monetizEventAttributeObj.promo_code = localStorage.getItem('promotional-voucher') ? localStorage.getItem('promotional-voucher')  : 'N.A';
                            // monetizEventAttributeObj.bank_name = "N.A.";
                            // monetizEventAttributeObj.cc_type = "N.A.";
                            monetizEventAttributeObj.partner_id = localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : null;
                            monetizEventAttributeObj.monetization_transaction_quantity = 1;


                        }
                        window.mobileAnalyticsClient.recordEvent('_monetization.failure', monetizEventAttributeObj, {});

                        // for immediate firing. 
                        window.mobileAnalyticsClient.submitEvents();

                        // End of AWS Mobile SDK Events
                        // console.log("fail");
                        _this.pageViewWebenage("campaign-failed");


                        _this.pageViewEvent("campaign-failed");

                        localStorage.removeItem("redirect_campaign");

                    }, 2000);
                    // NOTE end of fail payment part
        },
        pageViewEvent(status) {
              // console.log('[pageViewEvent > pageSelectAttributes]');

              let _this = this;
              setTimeout(function(){
                if (window.mobileAnalyticsClient) {
                  let pageSelectAttributes = _this.getAWSMACommonAttributes();
                  pageSelectAttributes.page_title = status;
                  pageSelectAttributes.page_url = window.location.href;

                  // console.log('[pageViewEvent > pageSelectAttributes]', pageSelectAttributes);

                  window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});

                  // for immediate firing. 
                    window.mobileAnalyticsClient.submitEvents();
                }
              },500);
            },
        initPaymentResult() {
            this.partnerDetailsFromConfig();
            this.promotionOrderCreation();
        }
    },
    components: {
         'pop-up-forgotpassword': forgotPassword,
    },
    mounted() {
         if (document.getElementsByClassName('app-bar')) {
                document.getElementsByClassName('app-bar')[0].style.display = "none"
        }
        if (document.getElementById('brand_color_class')) {
            document.getElementById('brand_color_class').style.display = "none"
        }
    },
    created() {
        this.setCounter = 1;
        this.setPaymentHeader();

        eventBus.$on('toggleForgotPassword', () => {
            this.isActiveForgotPasword = false;
        });
    

        this.altUser = JSON.parse(localStorage.getItem('altUser'));
        this.toggleLoader(true, 'false -> payment_results_voucher -> getOrder');
        this.email = localStorage.getItem('user_email');
        if(localStorage.getItem('orderList')) {
            this.partnerDetailsFromConfig();
            this.orderListArray = JSON.parse(localStorage.getItem('orderList'));
            // console.log(this.orderListArray);
            this.response = true;
            this.toggleLoader(false);
        } else {
            if (this.appActive) {
                 this.initPaymentResult();
            }
        }
    },
    mixins: [altMixins]
}
</script>
