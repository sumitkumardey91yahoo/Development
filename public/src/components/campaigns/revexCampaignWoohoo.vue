
<template>
    <div class="alt-help">
        <div class="subs-container" v-if="response==true">
            <div>
                <div class="paytm-subscribe-holder">
                    <div class="left-holder">
                        <img class="paytm-tick-logo" src="/src/assets/tick.svg" />
                    </div>
                    <div class="paytm-right-holder-desc" v-if="altMessages">
                        <h3 class="paytm-woohoo-title">WOOHOO!</h3>
                        <div class="premium-text" v-if="partnerDetails.woohooSuccessMessage">{{partnerDetails.woohooSuccessMessage}}</div>
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
            <div class="submit-btn grad-btn btn paytm-woohoo-page-button"  style="margin-bottom: 60px;" id="woohooButton" >
                <button type="button" style="font-size:18px" class="submit-btn grad-btn btn" @click="homeRedirect()">{{partnerDetails.continueWatchingButtonText}}</button>

                <p v-if="partnerDetails &&  partnerDetails.downloadButtonUrl && partnerDetails.downloadButtonText" style="text-decoration: underline;color: white;text-align: center;" @click="downloadRedirection()">{{partnerDetails.downloadButtonText}}</p>
            </div>


        </div>
        <!-- If Transaction Fails -->
        <div class="subs-container" v-if="response==false">
            <div class="subs-container">
                <div class="paytm-subscribe-holder">
                    <div class="left-holder-desc">
                        <h3 class="premium-new-price">{{price_symbol}}{{planPrice}}</h3>
                        <h3 class="premium-mnth">{{planValidity}}</h3>
                    </div>

                    <div class="right-holder-desc">
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

    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5T7BPPJ');

    import { eventBus } from '../../main';
    import { altMixins } from '../../mixins';
    import { mapGetters, mapMutations, mapActions } from 'vuex';

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
                altConfigPromo: undefined,
                partnerDetails: undefined,
            };
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
                this.setPaymentHeader();
                this.setSubscriptionHeader();
                this.partnerDetailsFromConfig();

                if(localStorage.getItem('orderList')) {
                    this.orderListArray = JSON.parse(localStorage.getItem('orderList'));
                    this.response = true;
                } else {
                    //  // console.log('[payment-results -> appActive]');
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
            'actTransactionWallet',
            'actGetOrders',
            'actSendEmailWithToken',
            'actProductResponse'
            ]),
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
            sendResetEmailPassword() {
                var emailData = {
                    login: this.email,
                    token_type: 'password',
                    uri: 'https://altbalaji.com/activate/'
                }
                this.actSendEmailWithToken(emailData).then(
                    (response) => {
                        if (response.status && response.status == 'ok') {
                             // console.log('[paytmCampaignWoohoo | sendResetEmailPassword | response ]', response);
                        }
                    },
                    (error) => {
                        if (error && error.message) {
                            // console.log('[paytmCampaignWoohoo | resetPassword | error ]', error);
                        }
                    }
                )
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

                var showMenu = document.getElementById('showMenu');
                if (showMenu) {
                    showMenu.style.display = 'none';
                }

                var brand_color_class = document.getElementById('brand_color_class');
                if (brand_color_class) {
                    brand_color_class.style.display = 'none';
                }

                this.toggleSearchIco(false);
                this.toggleCloseIco(false);
                this.toggleDeleteIco(false);
                this.toggleMenuIco(false);

            },
            paymentFailRedirection() {

                this.toggleMenuIco(true);
                // this.$router.push({ name: 'paymentPage' });

                this.$router.push({ name: 'help' });

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

                 window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        'event': 'gt_page_view',
                        'eventAction': 'page view',
                        'eventCategory': 'gt_page_view',
                        'eventLabel': 'page view',
                        'eventValue': 1,
                        'gtl_page_title': status
                    });

              },500);
            },
            initPaymentResult() {
                this.planPrice = localStorage.getItem('product_Price');
                this.planValidity = localStorage.getItem('product_validation');
                this.tranId = localStorage.getItem('tranId');
                this.price_symbol=localStorage.getItem('price_symbol');
                this.product_discount=localStorage.getItem('product_discount');
                this.product_Order_Id=localStorage.getItem('product_order');
                this.email = localStorage.getItem('user_email');

                let funcPayment = this.actTransactionWallet();
                if (localStorage.getItem("redirect_campaign")) {
                    funcPayment = this.actProductResponse();
                    localStorage.removeItem("redirect_campaign");
                }


                funcPayment.then((response) => {
                    this.setProductResponse(response);
                    this.getOrder();
                }, (error) => {
                    this.response=0;
                    this.toggleLoader(false, 'false -> payment-results');

                    // NOTE start payment part
                    let _this = this;
                    setTimeout(() => {
                        // AWS Mobile SDK Events
                        if (window.mobileAnalyticsClient) {
                            var monetizEventAttributeObj = this.getAWSMACommonAttributes();

                            monetizEventAttributeObj.product_id = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                            monetizEventAttributeObj.product_title = localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
                           //  monetizEventAttributeObj.product_currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                          //  monetizEventAttributeObj.product_type = (localStorage.getItem('paymentModeType') && localStorage.getItem('paymentModeType') == 'default') ? 'Subscription' : 'Binge';
                            monetizEventAttributeObj.order_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                            monetizEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';
                            monetizEventAttributeObj.monetization_transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';
                            monetizEventAttributeObj.monetization_transaction_store = localStorage.getItem("redirect_campaign") ? 'payu': "Wallet";

                            monetizEventAttributeObj.monetization_transaction_itemid = localStorage.getItem('product_order') ? localStorage.getItem('product_order')  : 'N.A';
                            // monetizEventAttributeObj.promo_code = localStorage.getItem('gtaVoucher') ? localStorage.getItem('gtaVoucher')  : 'N.A';
                            // monetizEventAttributeObj.bank_name = "N.A.";
                            // monetizEventAttributeObj.cc_type = "N.A.";
                            monetizEventAttributeObj.partner_id = localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : null;

                        }
                        window.mobileAnalyticsClient.recordEvent('_monetization.failure', monetizEventAttributeObj, {});

                        // for immediate firing. 
                        window.mobileAnalyticsClient.submitEvents();

                        // End of AWS Mobile SDK Events
                        // console.log("fail");
                        _this.pageViewEvent("campaign-payment-failed");

                        localStorage.removeItem("redirect_campaign");

                    }, 3000);
                    // NOTE end of fail payment part

                });
            },
            monthDateText(month) {
                var monthArray = new Array();
                monthArray=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                return monthArray[month];
            },
            getOrder() {
                this.actGetOrders(this.altUser).then((response) => {
                    var current_order_id=localStorage.getItem('product_order');

                    if(response.orders[0] === undefined || response.orders[0] === null) {
                        setTimeout(this.getOrder(),500);
                    } else {
                        if(current_order_id != response.orders[0].id) {
                            //// console.log("order not match");
                            setTimeout(this.getOrder(),500);
                        } else {
                            if (response.count && response.orders) {
                                //  this.toggleLoader(false, 'false -> payment-results');
                                this.response = 1;
                                this.accountOrders = response.orders[0];
                                var altGeoData = undefined;

                    
                                if (localStorage.getItem('altGeoData')) {
                                    altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
                                }

                             // GTM track 

                                this.gtmTrack(response);

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
                                this.toggleLoader(false, 'true -> payment-results');

                            } else {
                                this.toggleLoader(false, 'false -> payment-results');

                            }
                        }
                    }
                }, (error) => {
                    // console.log('[payment-results | getOrder | error | ]', error);
                });
            },
            gtmTrack(response) {
                var platformDetails = undefined;
                try {
                  platformDetails = this.altDetectPlatform();
                } catch(err) {}

                var altGeoData = undefined;
                if (localStorage.getItem('altGeoData')) {
                    altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
                }


                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  'event':'gt_purchase',
                  'eventAction':'purchase',
                  'eventCategory':'gt_purchase',
                  'eventLabel':'purchase',
                  'eventValue':1,
                  'gtl_revenue': response.orders[0].price.real_amount,
                  'gtl_currency': response.orders[0].price.currency,
                  'gtl_product_title': response.orders[0].product.titles.en,
                  'gtl_platform':(platformDetails && platformDetails.os) ? platformDetails.os : '' + " " + (platformDetails && platformDetails.osVersion) ? platformDetails.osVersion : '',
                  'gtl_device_make': (platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                  'gtl_country': altGeoData.country && altGeoData.country.iso_code ? altGeoData.country.iso_code : '',
                  'gtl_city': altGeoData.city && altGeoData.city.names && altGeoData.city.names.en ? altGeoData.city.names.en : '',
                  'gtl_device_timestamp':new Date().getTime(),
                  'gtl_payment_mode': localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : '',
                  'gtl_promo_code' : localStorage.getItem('gtaVoucher') ? localStorage.getItem('gtaVoucher') : 'NA',
                  'gtl_user_id': localStorage.getItem('account_id') ? localStorage.getItem('account_id') : ''
                });
            },
            setSubscriptionHeader() {
                this.setHeaderTitle('');
                this.toggleSearchIco(false);
                this.toggleCloseIco(false);
                this.toggleDeleteIco(false);
                this.toggleMenuIco(false);
                var showMenu = document.getElementById('showMenu');
                if (showMenu) {
                    showMenu.style.display = 'none';
                }
            },
            processOrders(orders) {
                var orderData = new Object();
                var tvodPlans = orders.filter((order) => {
                    return order.product.recurring == false;
                });

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

                this.toggleLoader(false, 'false -> payment-results');
                let _this = this;
                setTimeout(() => {
                    // AWS Mobile SDK Events
                    if (window.mobileAnalyticsClient) {
                        // var monetizEventAttributeObj = this.getAWSMACommonAttributes();
                        //
                        // monetizEventAttributeObj.product_id = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                        // monetizEventAttributeObj.product_title = localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
                        // monetizEventAttributeObj.product_currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                        // monetizEventAttributeObj.product_type = (localStorage.getItem('paymentModeType') && localStorage.getItem('paymentModeType') == 'default') ? 'Subscription' : 'Binge';
                        // monetizEventAttributeObj.order_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                        // monetizEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';
                        // monetizEventAttributeObj.monetization_transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';
                        // monetizEventAttributeObj.monetization_transaction_store = "Wallet";
                        // monetizEventAttributeObj.monetization_transaction_itemid = localStorage.getItem('product_order') ? localStorage.getItem('product_order')  : 'N.A';
                        // monetizEventAttributeObj.promo_code = localStorage.getItem('gtaVoucher') ? localStorage.getItem('gtaVoucher')  : 'N.A';
                        // monetizEventAttributeObj.bank_name = "N.A.";
                        // monetizEventAttributeObj.cc_type = "N.A.";
                        // monetizEventAttributeObj.partner_id = localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : null;

                        // NOTE monetization start
                        var monetizEventAttributeObj = this.getAWSMACommonAttributes();

                        monetizEventAttributeObj.product_id = localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A';
                        monetizEventAttributeObj.product_title = localStorage.getItem('productTitle') ? localStorage.getItem('productTitle') : 'N.A';
                        // monetizEventAttributeObj.product_currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                        // monetizEventAttributeObj.product_type = (localStorage.getItem('paymentModeType') && localStorage.getItem('paymentModeType') == 'default') ? 'Subscription' : 'Binge';
                        monetizEventAttributeObj.order_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                        //monetizEventAttributeObj._currency = localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency') : 'N.A';
                        // monetizEventAttributeObj._product_id = localStorage.getItem('product_order') ? localStorage.getItem('product_order') : 'N.A';
                        monetizEventAttributeObj.event_mode = localStorage.getItem('gtaGatewayType') ? localStorage.getItem('gtaGatewayType') : 'N.A';
                        monetizEventAttributeObj.monetization_transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';
                        // monetizEventAttributeObj._transaction_id = localStorage.getItem('tranId') ? localStorage.getItem('tranId') : 'N.A';
                        monetizEventAttributeObj.monetization_transaction_store = localStorage.getItem("redirect_campaign") ? 'payu': "Wallet";

                        monetizEventAttributeObj.monetization_transaction_itemid = localStorage.getItem('product_order') ? localStorage.getItem('product_order')  : 'N.A';
                        // monetizEventAttributeObj.promo_code = localStorage.getItem('gtaVoucher') ? localStorage.getItem('gtaVoucher')  : 'N.A';
                        // monetizEventAttributeObj.bank_name = "N.A.";
                        monetizEventAttributeObj.partner_id = localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : null;

                        var monetizationDetails = {
                          currency : localStorage.getItem('productCurrency') ? localStorage.getItem('productCurrency')  : 'N.A',
                          productId : localStorage.getItem('productId') ? localStorage.getItem('productId') : 'N.A',
                          quantity : 1,
                          price : localStorage.getItem('product_Price') ? localStorage.getItem('product_Price') : 'N.A'
                        }

                        window.mobileAnalyticsClient.recordMonetizationEvent(monetizationDetails, monetizEventAttributeObj, { package_price : parseInt(localStorage.getItem('product_Price')) });

                        // for imediate firing.
                        window.mobileAnalyticsClient.submitEvents();

                        // NOTE monetization added
                    }
                    // window.mobileAnalyticsClient.recordEvent('_monetization.Purchase', monetizEventAttributeObj, {});
                    // End of AWS Mobile SDK Events

                    _this.pageViewEvent("campaign-woohoo");

                    localStorage.removeItem("redirect_campaign");


                }, 2000);
            },

            gatewayFilter(partners) {
                let data = partners.filter(function(partner) {
                    return partner.enabled == "true";
                });
                return data;
            },
            partnerDetailsFromConfig() {
                let altConfig = undefined;
                let partners = undefined;
                let placeholder = undefined;
                altConfig = localStorage.getItem('altConfig') ? JSON.parse(localStorage.getItem('altConfig')) :undefined
                if(altConfig && altConfig.promo && altConfig.promo.partners && altConfig.promo.messages) {
                    this.altConfigPromo = altConfig.promo.messages;
                    partners = altConfig.promo.partners;
                    this.partnerDetails = this.gatewayFilter(partners);

                    this.partnerDetails = localStorage.getItem("selectedGateway") ? JSON.parse(localStorage.getItem("selectedGateway")) : undefined;

                } else if (altConfig && altConfig.campaign && altConfig.campaign.partners && altConfig.campaign.messages) {
                     this.altConfigPromo = altConfig.campaign.messages;
                    // partners = altConfig.promo.partners;
                    // this.partnerDetails = this.gatewayFilter(partners);

                    this.partnerDetails = localStorage.getItem("selectedGateway") ? JSON.parse(localStorage.getItem("selectedGateway")) : undefined;
                } else {
                    this.toggleMenuIco(true);
                    this.$router.push({ name: 'home' });
                }
            },
        },
        components: {
            // 'alt-modals': Modals,
        },
        created() {
            this.setPaymentHeader();
            this.partnerDetailsFromConfig();
            this.setSubscriptionHeader();
            this.toggleLoader(true);
            this.altUser= JSON.parse(localStorage.getItem('altUser'));
            this.email = localStorage.getItem('user_email');

            localStorage.setItem('paymentModeType','default');

            if (localStorage.getItem('paymentModeType')) {
                this.paymentModeType = localStorage.getItem('paymentModeType');
            }
        },
        mounted () {
            this.setPaymentHeader();
            this.partnerDetailsFromConfig();

            if (document.getElementsByClassName('app-bar')) {
                document.getElementsByClassName('app-bar')[0].style.display = "none"
            }

            window.addEventListener("orientationchange", function() {
             let paytm_footer = document.getElementById('woohooButton');
             if(paytm_footer) {
                 // console.log(window.screen.orientation.type);
                 if (window.screen.orientation.type == 'landscape-primary') {
                     paytm_footer.style.position = "relative";
                 } else {
                     paytm_footer.style.position = "absolute";
                 }
             }
         }, false);

            this.setSubscriptionHeader();
            if(localStorage.getItem('orderList')) {
                this.orderListArray = JSON.parse(localStorage.getItem('orderList'));
                this.toggleLoader(false);
                this.response = true;
            } else {
                if (this.appActive) {
                    this.initPaymentResult();
                }
            }
        },
        mixins: [altMixins]
    }
</script>
