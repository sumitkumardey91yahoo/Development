
<template lang="html">

    <div class="" style="margin-top: 8px;">
         <p style="font-size: large;margin: 15px;text-transform: uppercase;font-weight: bold">subscribe</p>
        <div class="subscribe-holder">
            <div class="left-holder-desc"> 
                <h3 class="premium-new-price" v-if="productInfomation && productInfomation.price_symbol && productInfomation.price" style="font-size: 26px;">
                    {{productInfomation.price_symbol}} {{productInfomation.price}}</h3>  
                <h3 class="premium-mnth" v-if="productInfomation && productInfomation.title "> {{productInfomation.title}} </h3>
            </div> 
            <div class="right-holder-desc">
                <ul class="premium-list-data premium-no-bg">
                      <li class="premium-list" v-for="item in altConfig.subscriptionPage.features">{{item}}</li>
                </ul>
            </div>
        </div>
        <h3 style="text-align: center;font-size:17px;margin-top: 20px;margin-bottom: 20px;"> How would you like to pay?</h3>


        <div v-if="homeDomain!='row'">
            <div v-if="mobile_wallet_flag == false" style="margin-left: 10px;margin-right: 10px;">
                <div v-for="gateway in paymentGatewayList" v-if="paymentGatewayList && gateway">
                    <li @click="getways(gateway.unique_id, gateway)" class="credit_Debit_li">
                        <div class="gateway_img_div"><img :src="gateway.logo" class="credit_debit_img"></img></div>
                        <div class="credit_debit">{{gateway.title}}</div>
                        <span><img src="../../assets/right.svg" class="credit_debit_arrow" ></span>
                    </li>
                </div>

                <li @click="Mobile_Wallets(true)" class="credit_Debit_li">
                    <div class="gateway_img_div"><img src="https://static.cloud.altbalaji.com/img/Payment_Page_Icons/mobilewallet.png" class="credit_debit_img" style="width:17px;"></img></div>
                    <div class="credit_debit">Mobile Wallets</div>
                    <div> <img src="../../assets/right.svg" class="credit_debit_arrow" ></div>
                </li>
            </div>

            <div v-else style="margin-left: 10px;margin-right: 10px;">
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
        </div>

        <div v-else>
             <li @click="getways('credit_card')" class="credit_Debit_li">
                    <div class="gateway_img_div"><img src="../../assets/cc-dc.png" class="credit_debit_img"></img></div>
                    <div class="credit_debit">Credit Card</div>
                    <div><img src="../../assets/right.svg" class="credit_debit_arrow"></div>
                </li>
        </div>




        <a href="" id="gatewayRedirectLink"></a>

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
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            altUser:undefined,
            orderIdCurrentProduct:undefined,
            real_amount:undefined,
            transactionId:undefined,
            gatewayUrlLink:undefined,
            freechargeData:undefined,
            oxigenFormData:undefined,
            hashkey:undefined,
            mobileNo:undefined,
            successUrl:undefined,
            userName:undefined,
            userEmail:undefined,
            productNameInfo:undefined,
            altConfigEnviroment:undefined,
            freechargeSFurl:undefined,
            paytmCallbackUrl:undefined,
            altConfig: undefined,
            paymentGatewayList: undefined,
            mobileWalletsBranch: undefined,
            mobile_wallet_flag: false,
            homeDomain: undefined,
            productInfomation: undefined,
            orderAnalyticsData: []
        }
    },
    computed: {
        ...mapGetters([
            'paymentProxyUrl'
        ]),
    },
    methods: {
        ...mapMutations([
            'setPaymentProxyUrl'
        ]),
        ...mapActions([
        'actPaytmHasCodeFeatures',
        'actMobikwikHasCodeFeatures',
        'actGetAccountDetails',
        'actCreateOrder',
        'actProductDetails',
        'actFreechargeHasCodeFeatures',
        'actAirtel_moneyHasCodeFeatures',
        'actOla_moneyHasCodeFeatures',
        'actOxigenHasCodeFeatures',
        'actCreateHash'
        ]),
        Mobile_Wallets(flag) {
            this.mobile_wallet_flag=flag;
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
         getways(getwayParameter, gatewayDetails) {
             console.log(getwayParameter);
             this.toggleLoader(true);

               if (window.mobileAnalyticsClient) {
                   this.orderAnalyticsData.event_mode = getwayParameter;
                   console.log("orderAnalyticsData", this.orderAnalyticsData);
                window.mobileAnalyticsClient.recordEvent('_product.checkout', this.orderAnalyticsData, {});
                }
           
             if (getwayParameter == 'net_banking') {
                 localStorage.setItem('gtaGatewayType', 'net_banking');
                   localStorage.setItem("redirect_campaign", true);
                  this.$router.push({name: 'revxNetbanking'});
             } else if (getwayParameter == 'debit_card') {
                 localStorage.setItem('gtaGatewayType', 'debit_card');
                 console.log("debit_card");

                   localStorage.setItem("redirect_campaign", true);
                 this.$router.push({name: 'revxDebit'});
             } else if (getwayParameter == 'credit_card') {
                 localStorage.setItem('gtaGatewayType', 'credit_card');

                   localStorage.setItem("redirect_campaign", true);
                 this.$router.push({name: 'revxCredit'});
             } else {
                this.gatewayRedirection(getwayParameter);
             }
         },
        oxigenHasCode() {
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            var orderData={};
            orderData.dataH={
                amount:parseFloat(this.real_amount).toFixed(2),
                mid:this.altConfigEnviroment.oxigenMid,
                mitem:this.orderIdCurrentProduct.toString(),
                mtrxid:this.transactionId,
                redirecturl: this.paymentProxyUrl + "payment/oxigen/response"
            };
            orderData.orderId=this.orderIdCurrentProduct;
            this.actOxigenHasCodeFeatures(orderData).then(
            (response) => {
                this.oxigenFormData=response;
                setTimeout(function(){  document.oxigenForm.submit(); }, 2000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            }
            )
        },

        paytmHasCode(type) {
            this.transactionId = this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            this.paytmCallbackUrl = this.paymentProxyUrl + 'payment/paytm/response';

            var orderData = {};
            orderData.dataH={
                REQUEST_TYPE:"DEFAULT",
                MID:this.altConfigEnviroment.paytm.web.mid,
                ORDER_ID:this.transactionId,
                CUST_ID:localStorage.getItem('user_email'),
                TXN_AMOUNT:this.real_amount.toString(),
                CHANNEL_ID:this.altConfigEnviroment.paytm.web.channel_id,
                INDUSTRY_TYPE_ID:this.altConfigEnviroment.paytm.web.industry_type_id,
                WEBSITE:this.altConfigEnviroment.paytm.web.website,
                MOBILE_NO:"9999999999",
                EMAIL:localStorage.getItem('user_email'),
                CALLBACK_URL: this.paytmCallbackUrl
            };
            orderData.orderId = this.orderIdCurrentProduct;
            this.actPaytmHasCodeFeatures(orderData).then((response) => {
                this.gatewayUrlLink=this.altConfigEnviroment.paytm.web.paytm_base_url+"?REQUEST_TYPE=DEFAULT&MID="+this.altConfigEnviroment.paytm.web.mid+"&ORDER_ID="+response.ORDER_ID+"&CUST_ID="+response.CUST_ID+"&TXN_AMOUNT="+response.TXN_AMOUNT+"&CHANNEL_ID="+this.altConfigEnviroment.paytm.web.channel_id+"&INDUSTRY_TYPE_ID="+this.altConfigEnviroment.paytm.web.industry_type_id+"&WEBSITE="+this.altConfigEnviroment.paytm.web.website+"&MOBILE_NO="+response.MOBILE_NO+"&EMAIL="+response.EMAIL+"&CALLBACK_URL="+this.paytmCallbackUrl+"&CHECKSUMHASH="+response.CHECKSUMHASH+"&payt_STATUS=1&";
                document.getElementById('gatewayRedirectLink').href = this.gatewayUrlLink;
                localStorage.setItem("paytmLinkHashCode",this.gatewayUrlLink);

                setTimeout(function(){
                    document.getElementById("gatewayRedirectLink").click();
                }, 1000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        freechargeHasCode() {
            this.transactionId = this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);

            this.freechargeSFurl = this.paymentProxyUrl + "payment/freecharge/response";

            var orderData={};
            orderData.dataH={
                merchantId: this.altConfigEnviroment.freechargeMid,
                merchantTxnId: this.transactionId,
                amount: this.real_amount.toString(),
                channel: "WEB",
                currency: "INR",
                surl: this.freechargeSFurl,
                furl: this.freechargeSFurl
            };
            // console.log(orderData.dataH);
            orderData.orderId=this.orderIdCurrentProduct;
            this.actFreechargeHasCodeFeatures(orderData).then((response) => {
                this.freechargeData = response;
                setTimeout(function(){  document.freechargeForm.submit(); }, 1000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        mobikwikHasCode() {
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            let email_id = localStorage.getItem('user_email');
            var orderData={};
            orderData.dataH={
                orderid: this.transactionId,
                amount: this.real_amount.toString(),
                email: email_id,
                cell: "",
                redirecturl: this.paymentProxyUrl + 'payment/mobikwik/response'
            };
            // console.log(orderData.dataH);
            orderData.orderId=this.orderIdCurrentProduct;
            this.actMobikwikHasCodeFeatures(orderData).then((response) => {
                // console.log(response);
                this.gatewayUrlLink=this.altConfigEnviroment.mobikwik_base_url+"?redirecturl="+response.redirecturl+"&mid="+response.mid+"&orderid="+response.orderid+"&amount="+response.amount+"&merchantname="+response.merchantname+"&checksum="+response.checksum+"&cell="+""+"&email="+email_id;

                document.getElementById('gatewayRedirectLink').href = this.gatewayUrlLink;
                localStorage.setItem("paytmLinkHashCode",this.gatewayUrlLink);
                setTimeout(function(){ document.getElementById("gatewayRedirectLink").click() }, 1000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        paytmOrderCreation(selectedPartner) {
            let productId = (selectedPartner && selectedPartner.productid) ? parseInt(selectedPartner.productid) : 53;
             console.log("paytmOrderCreation",selectedPartner);


             let selectedGateway = localStorage.getItem('selectedGateway') ? JSON.parse(localStorage.getItem('selectedGateway')) : '';
             if (this.homeDomain == 'row') {
                productId =  selectedGateway.productId.ROW;
             } else {
                 productId = selectedGateway.productId.IN;
             }
            

            let orderPayload = {
                "product": productId,
                "pricesheet_id": 9,
                "platform": "web",
                "payment_type": "payment_proxy"
            }
            
            if (localStorage.getItem("promo_code")) {
                orderPayload.promo_code = localStorage.getItem("promo_code");
            }
            

            this.actCreateOrder(orderPayload).then((response) => {
                localStorage.setItem('product_order',response.id);
                 console.log("response || ", response);
                 if (localStorage.getItem("promo_code")) {
                   localStorage.setItem('reduce_price',response.pricing.reduced_price.real_amount);
                      localStorage.removeItem("promo_code");
                 } else {
                     localStorage.setItem('reduce_price',null);
                 }
            
                this.orderDetails();
            },
            (error) => {

            });
        },
        airtel_moneyHasCodeFeatures() {
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
                FU: this.paymentProxyUrl + 'payment/airtel/response',
                SU: this.paymentProxyUrl + 'payment/airtel/response',
            };
            // console.log(orderData.dataH);
            orderData.orderId=this.orderIdCurrentProduct;
            this.actAirtel_moneyHasCodeFeatures(orderData).then((response) => {
                this.gatewayUrlLink=this.altConfigEnviroment.airtel_base_url+"?AMT="+parseFloat(this.real_amount).toFixed(2)+"&CUR="+response.CUR+"&DATE="+response.DATE+"&FU="+response.FU+"&HASH="+response.HASH+"&MID="+response.MID+"&SU="+response.SU+"&TXN_REF_NO="+response.TXN_REF_NO+"&";

                document.getElementById('gatewayRedirectLink').href = this.gatewayUrlLink;
                setTimeout(function(){ document.getElementById("gatewayRedirectLink").click() }, 1000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            })
        },
        ola_moneyHasCodeFeatures() {
            this.transactionId=this.createTranstionId(16);
            localStorage.setItem("tranId", this.transactionId);
            var orderData={};
            orderData.dataH={
                command: 'debit',
                accessToken: this.altConfigEnviroment.olaAccessToken,
                uniqueId: this.transactionId,
                comments: location.protocol + '//' + location.host+'/paymentStatus/',
                udf: this.orderIdCurrentProduct.toString(),
                returnUrl: this.paymentProxyUrl + 'payment/olamoney/response',
                notificationUrl: this.altConfigEnviroment.olaMoneyNotificationUrl,
                amount:  parseFloat(this.real_amount).toFixed(2),
                currency: 'INR',
                couponCode: 'NA'
            };
            orderData.orderId=this.orderIdCurrentProduct;
            this.actOla_moneyHasCodeFeatures(orderData).then((response) => {
                this.gatewayUrlLink=this.altConfigEnviroment.olaMoneyURL+"?bill="+ window.btoa(JSON.stringify(response));
                document.getElementById('gatewayRedirectLink').href = this.gatewayUrlLink;
                setTimeout(function(){ document.getElementById("gatewayRedirectLink").click() }, 1000);
            },
            (error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
            }
        )
    },
    payUwallet() {
        this.userEmail = localStorage.getItem('user_email');

        let usernameExtra = this.userEmail.split('@');
        this.userName = localStorage.getItem('user_name') ? localStorage.getItem('user_name') : usernameExtra[0];

        this.transactionId = this.createTranstionId(16);
        localStorage.setItem("tranId", this.transactionId);
        // this.successUrl="https://gvx62fail7.execute-api.ap-northeast-1.amazonaws.com/uat/payu?api="+currentHostNameSF+"/payment?";
        this.successUrl=this.altConfigEnviroment.paymentReturnURL+"?api="+location.protocol + '//' + location.host +"/paymentStatus?";
        if(localStorage.getItem('altAccount')==="undefined" || localStorage.getItem('altAccount').phoneNumber==null) {
            this.mobileNo="9999999999";
        } else {
            this.mobileNo=JSON.parse(localStorage.getItem('altAccount')).phoneNumber;
        }
        this.productNameInfo =  localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";

        var orderData = {};
        orderData.hash={
            hashSequence:"key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10",
            data:{
                key:this.altConfigEnviroment.payuKey,
                txnid:this.transactionId,
                surl:this.successUrl,
                furl:this.successUrl,
                amount:this.real_amount.toString(),
                email:this.userEmail,
                firstname:this.userName,
                productinfo: this.productNameInfo,
            }
        };
        orderData.orderId=this.orderIdCurrentProduct;
        this.actCreateHash(orderData).then((response) => {
            this.hashkey = response.hash;
            setTimeout(function(){  document.myform.submit(); }, 2000);
        },
        (error) => {
        })
    },
    orderDetails() {
        this.actProductDetails().then((response) => {
            console.log("paytmCampaignLogin | actProductDetails",response);

            this.productInfomation =  {};
            

            let price = response.price.real_amount;
            let productId = response.product.id;
            let productTitle = response.product.titles.default
            let productCurrency = response.price.currency;
            let product_order = response.id;
            let product_validation = response.product.titles.en;
            let product_title = response.product.titles.en;

            let price_symbol = (productCurrency == 'INR') ? '₹' : '$';

            this.productInfomation.title = response.product.titles.en;
            this.productInfomation.price = response.price.real_amount;
            this.productInfomation.price_symbol = price_symbol;


             this.real_amount = price;

            if (localStorage.getItem('reduce_price')!="null" ) {
                     this.real_amount=localStorage.getItem('reduce_price');
            }
           
            this.orderIdCurrentProduct = product_order;

            // NOTE this for voucher
           // localStorage.setItem('reduce_price',null);

           

            localStorage.setItem("product_Price",price);
            localStorage.setItem("productId",productId);
            localStorage.setItem("productTitle",productTitle);
            localStorage.setItem("productCurrency",productCurrency);
            localStorage.setItem("product_order",product_order);
            localStorage.setItem("product_validation",product_validation);
            localStorage.setItem("product-title",product_title);
            localStorage.setItem('price_symbol',price_symbol);


            // NOTE Analytics
            if (window.mobileAnalyticsClient) {
                 this.orderAnalyticsData = this.getAWSMACommonAttributes();
                 this.orderAnalyticsData.product_id = productId ? productId : 'N.A' ;
                 this.orderAnalyticsData.product_title = product_title ? product_title : 'N.A';
                 this.orderAnalyticsData.product_currency = productCurrency ? productCurrency : 'N.A';
                 this.orderAnalyticsData.product_type =  product_validation ? product_validation  : 'N.A';
                 this.orderAnalyticsData.order_id = product_order ? product_order : 'N.A';
                 this.orderAnalyticsData.user_state = localStorage.getItem("user_state") ? localStorage.getItem("user_state") : null;
                 this.orderAnalyticsData.partner_id = localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : null;
            }
            // end Analytics

            // NOTE gateway Redirection

            if (localStorage.getItem('isCampaign')) {
                console.log(" i am campaign")
            } else {
                this.gatewayRedirection();
            }
            
        },
        (error) => {

        });
    },
    gatewayRedirection(gatewayTitle) {
        // NOTE this for woohoo page refresh  data
       // this.toggleLoader(true);

        if(localStorage.getItem("orderList")) {
            localStorage.removeItem("orderList");
        }

        let gatewayName = this.partnerDetails && this.partnerDetails.name ? this.partnerDetails.name : undefined;
        if (gatewayTitle) {
            gatewayName = gatewayTitle;
        }
        // console.log("gatewayName",gatewayName);
        switch(gatewayName) {
            case "paytm" :
            localStorage.setItem('gtaGatewayType', 'Paytm');
            this.paytmHasCode()
            break;
            case "freecharge" :
            localStorage.setItem('gtaGatewayType', 'freecharge');
            this.freechargeHasCode();
            // console.log("freecharge selected");
            break;
            case "mobikwik" :
            localStorage.setItem('gtaGatewayType', 'mobikwik');
            this.mobikwikHasCode();
            // console.log("mobikwik selected");
            break;
            case "olamoney" :
            localStorage.setItem('gtaGatewayType', 'olamoney');
            this.ola_moneyHasCodeFeatures();
            // console.log("olamoney selected");
            break;
            case "airtel" :
            localStorage.setItem('gtaGatewayType', 'airtel');
            this.airtel_moneyHasCodeFeatures();
            // console.log("airtel selected");
            break;
            case "oxigen" :
            localStorage.setItem('gtaGatewayType', 'oxigen');
            this.oxigenHasCode();
            // console.log("oxigen selected");
            break;
            case "payu_other" :
            localStorage.setItem('gtaGatewayType', 'payu_other');
            this.payUwallet();
            // console.log("payu_other selected");
            break;
            default :
            // console.log("no choice");
            break;
        }
    },
    gatewayFilter(partners) {
        let data = partners.filter(function(partner) {
            return partner.enabled == "true";
        });
        return data;
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
            this.paymentGatewayList = countGateways;
             this.toggleLoader(false);
        },
        pageViewGTM() {
              window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'gt_page_view',
                'eventAction': 'page view',
                'eventCategory': 'gt_page_view',
                'eventLabel': 'page view',
                'eventValue': 1,
                'gtl_page_title': 'campaign-payment-options'
            });
        },
    partnerDetailsFromConfig() {
        let altConfig = undefined;
        let partners = undefined;
        let placeholder = undefined;
        altConfig = localStorage.getItem('altConfig') ? JSON.parse(localStorage.getItem('altConfig')) :undefined;
        this.altConfig = altConfig;

          this.altConfigEnviroment = altConfig && altConfig.environment ? altConfig.environment : undefined;

        this.setPaymentProxyUrl(this.altConfigEnviroment.paymentProxyURL);

        if(altConfig && altConfig.promo && altConfig.promo.partners && altConfig.promo.messages) {
            partners = altConfig.promo.partners;
            this.partnerDetails = this.gatewayFilter(partners);
            if(this.partnerDetails && this.partnerDetails.length == 0) {
                this.$router.push({ name: 'home' });
            } else {
                this.partnerDetails = localStorage.getItem("selectedGateway") ? JSON.parse(localStorage.getItem("selectedGateway")) : undefined;
                if(this.partnerDetails) {
                    this.paytmOrderCreation(this.partnerDetails);
                } else {
                    this.$router.push({ name: 'home' });
                }
            }
        } else if (altConfig && altConfig.campaign && altConfig.campaign.partners && altConfig.campaign.messages) {
             partners = altConfig.campaign.partners;
            this.partnerDetails = this.gatewayFilter(partners);
            if(this.partnerDetails && this.partnerDetails.length == 0) {
                this.$router.push({ name: 'home' });
            } else {
                this.partnerDetails = localStorage.getItem("selectedGateway") ? JSON.parse(localStorage.getItem("selectedGateway")) : undefined;
                if(this.partnerDetails) {
                    this.paytmOrderCreation(this.partnerDetails);
                } else {
                    this.$router.push({ name: 'home' });
                }
            }
            
        } else {
            this.$router.push({ name: 'home' });
        }
    },
        setSubscribePageHeader() {
            this.setHeaderTitle('subscribe');
            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
            this.toggleMenuIco(false);
        },
        beforeDestroy() {
            console.log("payment page");
              if (document.getElementsByClassName('app-bar')[0]) {
                 document.getElementsByClassName('app-bar')[0].style.display = "block"
              }
        }
    },
    
    created() {
        console.log("created | ");
        if (document.getElementsByClassName('app-bar')[0]) {
                 document.getElementsByClassName('app-bar')[0].style.display = "none"
        }
        this.homeDomain=localStorage.getItem('homeDomain');
        this.homeDomain=this.homeDomain.toLowerCase();
        
        this.pageViewGTM();
        this.setSubscribePageHeader();
        this.toggleLoader(true);
        this.partnerDetailsFromConfig();
        this.configPaymentArray();
    },

    mixins: [altMixins]
}
</script>
