<template>
    <div class="alt-help">
        <div class="subs-container">
            <alt-payment></alt-payment>
            <h3 class="voucher">GOT A VOUCHER CODE?</h3>
            <div style="margin: -8px 17px;">
                <div class="voucher-body"><input type="text" v-model="voucherValue" placeholder="Voucher Code" class="voucher-text">
                </div>
                <button type="button" @click="voucherAction" class="submit-btn grad-btn voucher-btn">OK</button>
                <span style="color:red;font-width:bold;">{{voucherErrorMessage}}</span>
            </div>
            <br/>
            <h3 style="text-align: center;font-size:17px;"> How would you like to pay?</h3>
            <ul class="main_gateway_ui" v-if="homeDomain!='row'">

                <div v-if="mobile_wallet_flag==false">

                    <div v-for="gateway in paymentGatewayList" v-if="paymentGatewayList && gateway">
                        <li @click="getways(gateway.unique_id,gateway)" class="credit_Debit_li">
                            <div class="gateway_img_div"><img :src="gateway.logo" class="credit_debit_img"></img></div>
                            <div class="credit_debit">{{gateway.title}}</div>
                            <span><img src="../../assets/right.svg" class="credit_debit_arrow" ></span>
                        </li>
                    </div>
                    <li @click="getways('Mobile_Wallets')" class="credit_Debit_li">
                        <div class="gateway_img_div"><img src="https://static.cloud.altbalaji.com/img/Payment_Page_Icons/mobilewallet.png" class="credit_debit_img" style="width:17px;"></img></div>
                        <div class="credit_debit">Mobile Wallets</div>
                        <div> <img src="../../assets/right.svg" class="credit_debit_arrow" ></div>
                    </li>
                </div>
                <div v-else>
                    <li @click="Mobile_Wallets(false)">
                        <span> <img src="../../assets/right.svg" class="credit_debit_arrow_left" style="transform: rotate(180deg);"></span>
                        <span class="credit_debit_left">Mobile Wallets</span>
                    </li>
                    <div v-for="wallet in mobileWalletsBranch" v-if="mobileWalletsBranch && wallet.unique_id != 'jio_money'">
                        <li @click="getways(wallet.unique_id)" class="credit_Debit_li">
                            <div class="gateway_img_div"><img :src="wallet.logo" class="credit_debit_img"></img></div>
                            <div class="credit_debit">{{wallet.title}}</div>
                            <div><img src="../../assets/right.svg" class="credit_debit_arrow" ></div>
                        </li>
                    </div>
                </div>
                <a href="" id="paytmLinkId"></a>
            </ul>
            <ul class="main_gateway_ui" v-else>
                <li @click="getways('credit_card')" class="credit_Debit_li">
                    <div class="gateway_img_div"><img src="../../assets/cc-dc.png" class="credit_debit_img"></img></div>
                    <div class="credit_debit">Credit Card</div>
                    <div><img src="../../assets/right.svg" class="credit_debit_arrow"></div>
                </li>
            </ul>

            <form v-if="altConfigEnviroment && altConfigEnviroment.payuURL" :action="altConfigEnviroment.payuURL" method="post" name="myform" id="myform">
                <input type="hidden" name="key" :value="altConfigEnviroment.payuKey">
                <input type="hidden" name="amount" :value="real_amount">
                <input type="hidden" name="txnid" :value="transactionId">
                <input type="hidden" name="productinfo" :value="productNameInfo">
                <input type="hidden" name="firstname" :value="userName">
                <input type="hidden" name="email" :value="userEmail">
                <input type="hidden" name="phone" :value="mobileNo">
                <input type="hidden" name="surl" :value="successUrl">
                <input type="hidden" name="furl" :value="successUrl">
                <input type="hidden" name="hash" v-if="hashkey" :value="hashkey">
            </form>

            <form enctype='application/json' :action="altConfigEnviroment.freecharge_base_url" method="POST" name="freechargeForm" id="freechargeForm" v-if="freechargeData">
                <input type="hidden" id="merchantId" name="merchantId" :value="freechargeData.merchantId">
                <input type="hidden" id="merchantTxnId" name="merchantTxnId" :value="freechargeData.merchantTxnId">
                <input type="hidden" id="amount" name="amount" :value="freechargeData.amount">
                <input type="hidden" id="channel" name="channel" value="WEB">
                <input type="hidden" id="checksum" name="checksum" :value="freechargeData.checksum">
                <input type="hidden" id="furl" name="furl" :value="freechargeSFurl">
                <input type="hidden" name="surl" id="surl" :value="freechargeSFurl">
                <input type="hidden" name="currency" id="currency" value="INR">
            </form>
            <form :action="altConfigEnviroment.oxigen_base_url" method="get" name="oxigenForm" v-if="oxigenFormData">
                <input type="hidden" name="amount" :value="oxigenFormData.amount">
                <input type="hidden" name="mid" :value="oxigenFormData.mid">
                <input type="hidden" name="mitem" :value="oxigenFormData.mitem">
                <input type="hidden" name="mtrxid" :value="oxigenFormData.mtrxid">
                <input type="hidden" name="redirecturl" :value="oxigenFormData.redirecturl">
            </form>
        </div>
        <alt-modals></alt-modals>
        <popup-payment-confirmation v-show="showPopupPaymentConfirm"></popup-payment-confirmation>
        <!-- <popup-payment-confirm v-show="showPopupPaymentConfirm"></popup-payment-confirm> -->
    </div>
</template>
<script>
const Header = () => import (/* webpackChunkName: "subscribe-Gateways-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "subscribe-Gateways-Modals" */ '../shared/Modals.vue');
const PopupPaymentConfirmation = () => import (/* webpackChunkName: "popup-payment-confirmation" */ '../shared/PopupPaymentConfirmation.vue');
const payment = () => import (/* webpackChunkName: "subscribe-Gateways-payment" */ './Main.vue');

import { altMixins } from '../../mixins';
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            voucherValue:undefined,
            voucherErrorMessage:undefined,
            paytmUrlLink:undefined,
            orderIdCurrentProduct:undefined,
            real_amount:undefined,
            transactionId:undefined,
            userName: undefined,
            userEmail: "",
            descriptions: undefined,
            successUrl: undefined,
            mobileNo: undefined,
            hashkey: undefined,
            freechargeData: undefined,
            oxigenFormData: undefined,
            mobile_wallet_flag: false,
            homeDomain: undefined,
            altConfig :undefined,
            mobileWalletsBranch : {},
            paymentGatewayList : {},
            // showPopupPaymentConfirm :false,
            paymentCallGateways :undefined,
            showPopupPaymentConfirm: false,
            productNameInfo : undefined,
            //remove hard-code value
            altConfigEnviroment:undefined,
            freechargeSFurl:undefined,
            paytmCallbackUrl:undefined,

        }
    },
    computed: {
        ...mapGetters([
            'paytmHash',
            'altSubsPageMessages',
            'paymentProxyUrl'
        ]),
    },
    methods: {
        ...mapMutations([
            'setPaytmHas',
            'setPaymentConformation',
            'setPaymentProxyUrl'

        ]),
        ...mapActions([
            'actPromoWithPurches',
            'actPaytmHasCode',
            'actFreechargeHasCode',
            'actMobikwikHasCode',
            'actAirtel_moneyHasCode',
            'actOla_moneyHasCode',
            'actOxigenHasCode',
            'actCreateHash',
        ]),
        voucherAction() {
            this.toggleLoader(true);
            this.voucherErrorMessage="";
            if (this.voucherValue != undefined) {
                var promocodePayload = {
                    product : localStorage.getItem('productId'),
                    pricesheet_id : 9,
                    platform : "web",
                    payment_type : "payment_proxy",
                    promo_code: this.voucherValue
                };

                this.actPromoWithPurches(promocodePayload).then((response) => {
                    localStorage.setItem('gtaVoucher', this.voucherValue);

                    this.orderIdCurrentProduct=response.id;
                    this.voucherErrorMessage="Voucher code applied successfully";
                    localStorage.setItem("product_order", this.orderIdCurrentProduct);
                    localStorage.setItem('reduce_price',response.pricing.reduced_price.real_amount);
                    
                    this.toggleLoader(false);
                    if(response.pricing.reduced_price.real_amount==0) {
                        window.location.replace(location.protocol + '//' + location.host + "/payment_results_voucher");
                    } else {
                        eventBus.$emit("toggleVoucherPrice",true);
                    }
                }, (err) => {
                    this.voucherErrorMessage=err.message;
                    this.toggleLoader(false);
                });
            } else {
                this.voucherErrorMessage="Enter voucher code";
                this.toggleLoader(false);
            }
        },
        createTranstionId(len) {
            var transactionIdCreated = undefined;
            if(localStorage.getItem('product_order')) {
                  transactionIdCreated = localStorage.getItem('product_order') + (new Date().getTime() / 1000)
                    return  String(parseInt(transactionIdCreated));
            } else {
              var text = "";
               var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
               for( var i=0; i < len; i++ ) {
                   text += charset.charAt(Math.floor(Math.random() * charset.length));
               }
               return text;
            }
        },
        paytmHasCode(type) {
            // console.log('[type]', type);
            this.toggleLoader(true);
            if(localStorage.getItem('reduce_price')!="null"){
                this.real_amount=localStorage.getItem('reduce_price');
            }
            else {
                this.real_amount=localStorage.getItem('product_Price');
            }
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);

            this.paytmCallbackUrl = this.paymentProxyUrl + 'payment/paytm/response';

            var orderData={};
            orderData.dataH={
                REQUEST_TYPE:"DEFAULT",
                MID:this.altConfigEnviroment.paytm.web.mid,
                ORDER_ID:this.transactionId,
                CUST_ID:localStorage.getItem('user_email'),
                TXN_AMOUNT:this.real_amount,
                CHANNEL_ID:this.altConfigEnviroment.paytm.web.channel_id,
                INDUSTRY_TYPE_ID:this.altConfigEnviroment.paytm.web.industry_type_id,
                WEBSITE:this.altConfigEnviroment.paytm.web.website,
                MOBILE_NO:"9999999999",
                EMAIL:localStorage.getItem('user_email'),
                CALLBACK_URL: this.paytmCallbackUrl,
            };
            orderData.orderId=this.orderIdCurrentProduct;
            // console.log(orderData);
            this.actPaytmHasCode(orderData).then((response) => {
                // console.log(response);
                this.paytmUrlLink = this.altConfigEnviroment.paytm.web.paytm_base_url + "?REQUEST_TYPE=DEFAULT&MID="+this.altConfigEnviroment.paytm.web.mid+"&ORDER_ID="+response.ORDER_ID+"&CUST_ID="+response.CUST_ID+"&TXN_AMOUNT="+response.TXN_AMOUNT+"&CHANNEL_ID="+this.altConfigEnviroment.paytm.web.channel_id+"&INDUSTRY_TYPE_ID="+this.altConfigEnviroment.paytm.web.industry_type_id+"&WEBSITE="+this.altConfigEnviroment.paytm.web.website+"&MOBILE_NO="+response.MOBILE_NO+"&EMAIL="+response.EMAIL+"&CALLBACK_URL="+this.paytmCallbackUrl+"&CHECKSUMHASH="+response.CHECKSUMHASH+"&payt_STATUS=1&";
                document.getElementById('paytmLinkId').href =this.paytmUrlLink;
                this.setPaytmHas(response);

                setTimeout(function(){
                    document.getElementById("paytmLinkId").click();
                }, 2000);


            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        freechargeHasCode() {
            if(localStorage.getItem('reduce_price')!="null"){
                this.real_amount=localStorage.getItem('reduce_price');
            } else {
                this.real_amount=localStorage.getItem('product_Price');
            }
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            this.freechargeSFurl = this.paymentProxyUrl + "payment/freecharge/response";

            var orderData={};
            orderData.dataH={
                merchantId: this.altConfigEnviroment.freechargeMid,
                merchantTxnId: this.transactionId,
                amount: this.real_amount,
                channel: "WEB",
                currency: "INR",
                surl: this.freechargeSFurl,
                furl: this.freechargeSFurl
            };
            // console.log(orderData.dataH);
            orderData.orderId=this.orderIdCurrentProduct;
            this.actFreechargeHasCode(orderData).then((response) => {
                // console.log(response);
                this.freechargeData=response;
                setTimeout(function(){  document.freechargeForm.submit(); }, 2000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        mobikwikHasCode() {
            if(localStorage.getItem('reduce_price')!="null"){
                this.real_amount=localStorage.getItem('reduce_price');
            } else {
                this.real_amount=localStorage.getItem('product_Price');
            }
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            var orderData={};
            orderData.dataH={
                orderid: this.transactionId,
                amount: this.real_amount,
                email: this.userEmail,
                cell: "",
                redirecturl: this.paymentProxyUrl + 'payment/mobikwik/response'
            };
            // console.log(orderData.dataH);
            orderData.orderId=this.orderIdCurrentProduct;
            this.actMobikwikHasCode(orderData).then((response) => {
                // console.log(response);
                this.paytmUrlLink= this.altConfigEnviroment.mobikwik_base_url+"?redirecturl="+response.redirecturl+"&mid="+response.mid+"&orderid="+response.orderid+"&amount="+response.amount+"&merchantname="+response.merchantname+"&checksum="+response.checksum+"&cell="+""+"&email="+this.userEmail;
                document.getElementById('paytmLinkId').href =this.paytmUrlLink;
                // console.log(this.paytmUrlLink);
                setTimeout(function(){ document.getElementById("paytmLinkId").click() }, 2000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        airtel_moneyHasCode() {
            if(localStorage.getItem('reduce_price')!="null"){
                this.real_amount=localStorage.getItem('reduce_price');
            } else {
                this.real_amount=localStorage.getItem('product_Price');
            }
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);

            var d = new Date();
            var day=d.getDate().toString().length<2?"0"+d.getDate():d.getDate();
            var m=d.getMonth()+1;
            var month=m.toString().length<2?"0"+m:m;
            var hours=d.getHours().toString().length<2?"0"+d.getHours():d.getHours();
            var minutes=d.getMinutes().toString().length<2?"0"+d.getMinutes():d.getMinutes();
            var currentTime=day+""+month+""+d.getFullYear()+""+hours+""+minutes;
            var orderData={};
            orderData.dataH={
                TXN_REF_NO: this.transactionId,
                MID:this.altConfigEnviroment.airtelMoneyMid,
                AMT: parseFloat(this.real_amount).toFixed(2),
                DATE: currentTime,
                CUR: "INR",
                FU:  this.paymentProxyUrl + 'payment/airtel/response',
                SU:  this.paymentProxyUrl + '/payment/airtel/response',
            };
            // console.log(orderData.dataH);
            orderData.orderId=this.orderIdCurrentProduct;
            this.actAirtel_moneyHasCode(orderData).then((response) => {
                // console.log(response);
                this.paytmUrlLink= this.altConfigEnviroment.airtel_base_url+"?AMT="+parseFloat(this.real_amount).toFixed(2)+"&CUR="+response.CUR+"&DATE="+response.DATE+"&FU="+response.FU+"&HASH="+response.HASH+"&MID="+response.MID+"&SU="+response.SU+"&TXN_REF_NO="+response.TXN_REF_NO+"&";
                document.getElementById('paytmLinkId').href = this.paytmUrlLink;
                // console.log(this.paytmUrlLink);
                setTimeout(function(){ document.getElementById("paytmLinkId").click() }, 2000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        ola_moneyHasCode() {
            if (localStorage.getItem('reduce_price')!="null") {
                this.real_amount=localStorage.getItem('reduce_price');
            } else {
                this.real_amount=localStorage.getItem('product_Price');
            }

            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            var orderData={};
            orderData.dataH={
                command: 'debit',
                accessToken: this.altConfigEnviroment.olaAccessToken,
                uniqueId: this.transactionId,
                comments: location.protocol + '//' + location.host +'/payment_results_wallet/',
                udf: this.orderIdCurrentProduct,
                returnUrl:  this.paymentProxyUrl + 'payment/olamoney/response',
                notificationUrl: this.altConfigEnviroment.olaMoneyNotificationUrl,
                amount:  parseFloat(this.real_amount).toFixed(2),
                currency: 'INR',
                couponCode: 'NA'
            };
            // console.log(orderData.dataH);
            orderData.orderId=this.orderIdCurrentProduct;
            this.actOla_moneyHasCode(orderData).then((response) => {
                // console.log(response);
                this.paytmUrlLink = this.altConfigEnviroment.olaMoneyURL+"?bill="+ window.btoa(JSON.stringify(response));
                document.getElementById('paytmLinkId').href = this.paytmUrlLink;
                // console.log(this.paytmUrlLink);
                setTimeout(function(){ document.getElementById("paytmLinkId").click() }, 2000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            }
            )
        },
        oxigenHasCode() {
            if(localStorage.getItem('reduce_price')!="null"){
                this.real_amount=localStorage.getItem('reduce_price');
            } else {
                this.real_amount=localStorage.getItem('product_Price');
            }
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            var orderData={};
            orderData.dataH={
                amount:parseFloat(this.real_amount).toFixed(2),
                mid:this.altConfigEnviroment.oxigenMid,
                mitem: this.orderIdCurrentProduct.toString(),
                mtrxid:this.transactionId,
                redirecturl: this.paymentProxyUrl + "payment/oxigen/response"
            };
            orderData.orderId=this.orderIdCurrentProduct;
            this.actOxigenHasCode(orderData).then(
            (response) => {
                this.oxigenFormData=response;
                setTimeout(function(){  document.oxigenForm.submit(); }, 2000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            }
            )
        },
        payUwallet() {
            if(localStorage.getItem('reduce_price')!="null"){
                this.real_amount=localStorage.getItem('reduce_price');
            } else {
                this.real_amount=localStorage.getItem('product_Price');
            }
            this.userEmail = localStorage.getItem('user_email');
            let usernameExtra = this.userEmail.split('@');
            this.userName = localStorage.getItem('user_name') ? localStorage.getItem('user_name') : usernameExtra[0];
            var currentHostNameSF=localStorage.getItem('currentHostNameSF');
            this.transactionId = this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            // this.successUrl="https://gvx62fail7.execute-api.ap-northeast-1.amazonaws.com/uat/payu?api="+currentHostNameSF+"/payment?";
            this.successUrl=this.altConfigEnviroment.paymentReturnURL+"?api="+location.protocol + '//' + location.host;
            if(localStorage.getItem('altAccount')==="undefined" || localStorage.getItem('altAccount').phoneNumber==null) {
                this.mobileNo="9999999999";
            } else {
                this.mobileNo=JSON.parse(localStorage.getItem('altAccount')).phoneNumber;
            }
            this.productNameInfo =  localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";

            var orderData={};
            orderData.hash={
                hashSequence:"key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10",
                data:{
                    key:this.altConfigEnviroment.payuKey,
                    txnid:this.transactionId,
                    surl:this.successUrl,
                    furl:this.successUrl,
                    amount:this.real_amount,
                    email:this.userEmail,
                    firstname:this.userName,
                    productinfo: this.productNameInfo,
                }
            };
            orderData.orderId=this.orderIdCurrentProduct;
            // console.log(orderData.hash);

            this.actCreateHash(orderData).then((response) => {
                // console.log(response);
                this.hashkey = response.hash;
                setTimeout(function(){  document.myform.submit(); }, 2000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        Mobile_Wallets(flag) {
            this.mobile_wallet_flag=flag;
        },
        getways(getwayParameter,gatewayDetails) {
            if (getwayParameter=='credit_card') {
                localStorage.setItem('moneteGatewayType', 'CC');
                localStorage.setItem('gtaGatewayType', 'Credit Card');

                if(gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);

                    this.paymentCallGateways = "credit_card";
                    this.showPopupPaymentConfirm = true;
                } else {
                    this.$router.push('credit');
                }
            } else if(getwayParameter=='debit_card') {
                localStorage.setItem('moneteGatewayType', 'DC');
                localStorage.setItem('gtaGatewayType', 'Debit Card');

                if(gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="debit_card";
                    this.showPopupPaymentConfirm = true;
                } else {
                    this.$router.push('debit');
                }
            } else if (getwayParameter=='paytm') {
                localStorage.setItem('moneteGatewayType', 'Paytm');
                localStorage.setItem('gtaGatewayType', 'Paytm');
                if (gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="paytm";
                    this.showPopupPaymentConfirm = true;

                    if(document.getElementById('alt-app')) {
                        document.getElementById('alt-app').style.position = "fixed";
                    }

                }
                else {
                    this.toggleLoader(true);
                    this.paytmHasCode();
                }
            } else if(getwayParameter=='freecharge') {
                localStorage.setItem('moneteGatewayType', 'Freecharge');
                localStorage.setItem('gtaGatewayType', 'Freecharge');
                if(gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="freecharge";
                    this.showPopupPaymentConfirm = true;

                    if(document.getElementById('alt-app')) {
                        document.getElementById('alt-app').style.position = "fixed";
                    }

                } else {
                    this.toggleLoader(true);
                    this.freechargeHasCode();
                }
            } else if (getwayParameter=='mobikwik') {
                localStorage.setItem('moneteGatewayType', 'Mobikwik');
                localStorage.setItem('gtaGatewayType', 'Mobikwik');
                if(gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="mobikwik";
                    this.showPopupPaymentConfirm = true;

                    if(document.getElementById('alt-app')) {
                        document.getElementById('alt-app').style.position = "fixed";
                    }


                } else {
                    this.toggleLoader(true);
                    this.mobikwikHasCode();
                }
            } else if (getwayParameter=='airtel') {
                localStorage.setItem('moneteGatewayType', 'Airtel Money');
                localStorage.setItem('gtaGatewayType', 'Airtel Money');
                if(gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="airtel";
                    this.showPopupPaymentConfirm = true;

                    if(document.getElementById('alt-app')) {
                        document.getElementById('alt-app').style.position = "fixed";
                    }

                } else {
                    this.toggleLoader(true);
                    this.airtel_moneyHasCode();
                }
            } else if (getwayParameter=='olamoney') {
                localStorage.setItem('moneteGatewayType', 'Ola Money');
                localStorage.setItem('gtaGatewayType', 'Ola Money');

                if (gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="olamoney";
                    this.showPopupPaymentConfirm = true;

                    if(document.getElementById('alt-app')) {
                        document.getElementById('alt-app').style.position = "fixed";
                    }

                } else {
                    this.toggleLoader(true);
                    this.ola_moneyHasCode();
                }
            }
            else if(getwayParameter=='oxigen') {
                localStorage.setItem('moneteGatewayType', 'Oxigen');
                localStorage.setItem('gtaGatewayType', 'Oxigen');

                if(gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="oxigen";
                    this.showPopupPaymentConfirm = true;

                    if(document.getElementById('alt-app')) {
                        document.getElementById('alt-app').style.position = "fixed";
                    }

                } else {
                    this.toggleLoader(true);
                    this.oxigenHasCode();
                }
            }
            else if (getwayParameter=='payu_other') {
                localStorage.setItem('moneteGatewayType', 'Payu Wallet');
                localStorage.setItem('gtaGatewayType', 'Payu Wallet');

                if (gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="payu_other";
                    this.showPopupPaymentConfirm = true;

                    if(document.getElementById('alt-app')) {
                        document.getElementById('alt-app').style.position = "fixed";
                    }

                } else {
                    this.toggleLoader(true);
                    this.payUwallet();
                }
            }
            else if (getwayParameter=='Mobile_Wallets') {

                this.Mobile_Wallets(true);
            }
            else if (getwayParameter== 'net_banking') {
                localStorage.setItem('moneteGatewayType', 'NB');
                localStorage.setItem('gtaGatewayType', 'Net Banking');

                if(gatewayDetails && gatewayDetails.user_confirmation) {
                    this.setPaymentConformation(gatewayDetails);
                    this.paymentCallGateways="net_banking";
                    this.showPopupPaymentConfirm = true;
                } else {
                    this.$router.push('netbanking');
                }
            } else {
                // console.log("gateway.vue|gateway no set");
            }
        },
        configPaymentArray () {
            var countGateways=[];
            for(var i in this.altConfig.payment_config) {
                if(this.altConfig.payment_config[i].title == "Mobile Wallets") {
                    this.mobileWalletsBranch=this.altConfig.payment_config[i].provider_list;
                } else {
                    var paymentDomain=undefined;
                    switch (this.altConfig.payment_config[i].unique_id) {
                        case "paytm":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "mobikwik":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "credit_card":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "debit_card":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "net_banking":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "payu_other":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "olamoney":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "freecharge":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "airtel":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                        case "Oxigen":
                        paymentDomain = this.altConfig.payment_config[i];
                        break;
                    }
                    if(paymentDomain) {
                        countGateways.push(paymentDomain);
                    }
                }
            }
            this.paymentGatewayList=countGateways;
            // this.toggleLoader(false);
        },
        paymentCallCB() {
            // console.log("gateways details" + this.paymentCallGateways);

            if (this.paymentCallGateways == "paytm") {
                this.toggleLoader(true);
                this.paytmHasCode();
            } else if (this.paymentCallGateways == "mobikwik") {
                this.toggleLoader(true);
                this.mobikwikHasCode();
            } else if (this.paymentCallGateways == "airtel") {
                this.toggleLoader(true);
                this.airtel_moneyHasCode();
            } else if (this.paymentCallGateways == "olamoney") {
                this.toggleLoader(true);
                this.ola_moneyHasCode();
            } else if (this.paymentCallGateways == "oxigen") {
                this.toggleLoader(true);
                this.oxigenHasCode();
            } else if (this.paymentCallGateways == "payu_other") {
                this.toggleLoader(true);
                this.payUwallet();
            } else if (this.paymentCallGateways == "net_banking") {
                this.toggleLoader(true);
                this.$router.push('netbanking');
            } else if (this.paymentCallGateways == "credit_card") {
                this.toggleLoader(true);
                this.$router.push('credit');
            } else if (this.paymentCallGateways == "debit_card") {
                this.toggleLoader(true);
                this.$router.push('debit');
            } else if (this.paymentCallGateways == "freecharge") {
                this.toggleLoader(true);
                this.freechargeHasCode();
            } else {
                // console.log("no matching");
            }
        }
    },
    components: {
        'help-header': Header,
        'alt-modals': Modals,
        'alt-payment': payment,
        // NOTE: To be removed
        // 'popup-payment-confirm':PopupPaymentConformation,
        'popup-payment-confirmation': PopupPaymentConfirmation,
    },
    mounted() {
        let config = undefined;
        config = localStorage.getItem("altConfig")  ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
        this.altConfigEnviroment = config && config.environment ? config.environment : undefined;

        this.setPaymentProxyUrl(this.altConfigEnviroment.paymentProxyURL);

        // console.log("Gateways.vue | mounted",this.paymentProxyUrl);
    },
    created() {
         // console.log('[Gateways | created ]');
         //NOTE added sumit for refresh wooho page 08/01/2018  *****
         localStorage.removeItem("orderList");



         //NOTE added by sumit 11.01.2018**
         this.orderIdCurrentProduct = localStorage.getItem("product_order");

         if(!this.orderIdCurrentProduct) {
             this.$router.push('home');
         }

        eventBus.$on('togglePaymentConformationPopup', (state) => {
            // console.log('[Gateways | created | togglePaymentConformation | ]');
            this.showPopupPaymentConfirm = state;
        });

        eventBus.$on('togglePopupConfirmPayment', (state) => {
            this.showPopupPaymentConfirm = state;
        });

        eventBus.$on('proceedToPaymentEvent', this.paymentCallCB);


        localStorage.setItem('gtaVoucher', '');
        this.homeDomain=localStorage.getItem('homeDomain');
        this.homeDomain=this.homeDomain.toLowerCase();

        if(localStorage.getItem("altConfig")) {
            // console.log(JSON.parse(localStorage.getItem("altConfig")));
            this.altConfig = JSON.parse(localStorage.getItem("altConfig"));
        }
        this.configPaymentArray();
        if(localStorage.getItem('user_email')) {
            this.userEmail = localStorage.getItem('user_email');
        }
    },
    beforeDestroy() {
        eventBus.$off('togglePaymentProcess');
        eventBus.$off('togglePaymentConformationPopup');
    },
    mixins: [altMixins]
}
</script>
