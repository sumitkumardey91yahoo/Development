<template>
    <div class="alt-helpp">
        <div class="subs-container">
            <alt-payment></alt-payment>

            <div class="payment">
            <p style="font-weight: bold">Debit Card </p>
                <form name="myform" :action="payuURL" method="post"   >
                    <div  id="card-number-field">
                        <input type="text" class="form-ctrl-white" placeholder="Card Number"  id="cardNumber" name="ccnum" required="" @blur="validate_creditcardnumber();" @keyup="validate_creditcardnumber();" >
                        <span v-show="cardVali">Must be a valid 15/16 digit number</span>
                    </div>
                    <div class=" owner">
                        <input type="text" class="form-ctrl-white" placeholder="Name of the Card" id="owner" name="ccname" required="">
                    </div>

                    <div class="form-group-60">
                        <input type="text" class="form-ctrl-white" name="ccexpmon" id="month" placeholder="MM" required=""  @blur="validate_month();" @keyup="validate_month();" maxlength="2" style="width:25%;">
                        <input type="text" class="form-ctrl-white" id="year" name="ccexpyr" placeholder="YYYY" required=""  @blur="validate_year()" @keyup="validate_year()" maxlength="4" style="width:27%;">

                        <img src="../../assets/card-back.png" class="card-back"  v-if="firefox==0">
                         <img src="../../assets/card-back.png" class="card-back"  style="width:60%" v-else>
                        <div class="CVV">
                            <input type="text" class="form-ctrl-white" placeholder="cvv" id="cvv" name="ccvv" required=""  @blur="validate_cvv();" @keyup="validate_cvv();"  style="width:95%;">
                        </div>
                    </div>

                    <div class="form-group-60">
                       <span v-show="cardMonth" style="width:15%">Needs to be a numeric value, between 1 and 12.</span>
                        <span v-show="cardYear" style="padding: 0% 7%;">Must be a valid expiry year.</span>
                        <span v-show="cardCvv"> Must have a length of exactly 3/4 digits.</span>
                    </div>

                    <input type="hidden" name="key" :value="payUkey">
                    <input type="hidden" name="amount" :value="real_amount">
                    <input  type="hidden" name="txnid" :value="tnxno">
                    <input  type="hidden" name="productinfo" :value="descriptions">
                    <input type="hidden" name="firstname" :value="userName">
                    <input type="hidden" name="email" :value="userEmail">
                    <input type="hidden" name="phone" :value="mobileNo">
                    <input type="hidden" name="surl" :value="successUrl">
                    <input type="hidden" name="furl" :value="successUrl">
                    <input type="hidden" v-if="createHashD" name="hash" :value="createHashD.hash">
                    <input type="hidden" name="pg" value="DC">
                    <input type="hidden" name="bankcode" value="DC">
                    <br><br>
                    <div id="pay-now">
                        <button type="submit" id="confirm-purchase" class="submit-btn grad-btn voucher-btn">PURCHASE</button>
                    </div>
                </form>
            </div>
            <!-- debit card and credit card -->
        </div>

    </div>
</template>
<script>
const Header = () => import (/* webpackChunkName: "subscribe-Credit-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "subscribe-Credit-Modals" */ '../shared/Modals.vue');
const payment = () => import (/* webpackChunkName: "subscribe-Credit-payment" */ './Main.vue');

// import Header from './Header.vue';
// import Modals from '../shared/Modals.vue';
// import payment from './Main.vue';

import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
    export default {
        data(){
            return {
                tnxno: undefined,
                userName: undefined,
                userEmail: undefined,
                descriptions: undefined,
                real_amount: undefined,
                successUrl: undefined,
                mobileNo: undefined,
                cardVali:0,
                cardYear:0,
                cardCvv:0,
                cardMonth:0,
                firefox:0,
                payUkey:undefined,
                altConfigEnviroment:undefined,
                payuURL:undefined,
            };
        },
        computed: {
            ...mapGetters([
                'createHashD',
                'singleProductPaymentD'
            ]),
        },
        methods: {
            ...mapMutations([
                'setCreateHashD',
                'setSingleProductPaymentD'
            ]),
            ...mapActions([
                'actCreateHashD',
                'actSingleProductPaymentD'

            ]),
            createTranstionIdD(len) {
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
            validate_creditcardnumber() {
                
                if(document.myform.cardNumber.value!=="") {
                      var re16digit = /^\d{16}$/;
                    let re15digit =/^\d{15}$/;
                    if (re16digit.test(document.myform.cardNumber.value) || re15digit.test(document.myform.cardNumber.value) ) {
                        this.cardVali=0;
                    } else {
                        this.cardVali=1;
                    }
                } else {
                    this.cardVali=0;
                }
                if (this.cardVali || this.cardCvv || this.cardYear || this.cardMonth) {
                 document.getElementById("confirm-purchase").disabled = true;
                } else {
                     document.getElementById("confirm-purchase").disabled = false;
                }
            },
            validate_cvv() {
                if(document.myform.cvv.value!=="") {
                      var cvv = /^\d{3}$/
                    var cvv_four = /^\d{4}$/
                    if (cvv.test(document.myform.cvv.value) || cvv_four.test(document.myform.cvv.value)) {
                        this.cardCvv = 0;
                    } else {
                        this.cardCvv=1;
                    }
                } else {
                    this.cardCvv=0;
                }
                if(this.cardVali || this.cardCvv || this.cardYear || this.cardMonth) {
                 document.getElementById("confirm-purchase").disabled = true;
                } else {
                     document.getElementById("confirm-purchase").disabled = false;
                }
            },

            validate_year() {
                if(document.myform.year.value!=="") {
                    var year = /^\d{4}$/
                    if (!year.test(document.myform.year.value) || document.myform.year.value<=2016) {
                        this.cardYear=1;
                    } else {
                        this.cardYear=0;
                    }
                } else {
                    this.cardYear=0;
                }
                if (this.cardVali || this.cardCvv || this.cardYear || this.cardMonth) {
                 document.getElementById("confirm-purchase").disabled = true;
                } else {
                     document.getElementById("confirm-purchase").disabled = false;
                }
            },
            validate_month() {
                if(document.myform.month.value!=="") {
                    var month = /^\d{2}$/
                    if (!month.test(document.myform.month.value) || document.myform.month.value>12) {
                        this.cardMonth=1;
                    } else {
                        this.cardMonth=0;
                    }
                } else {
                    this.cardMonth=0;
                }
                if (this.cardVali || this.cardCvv || this.cardYear || this.cardMonth) {
                 document.getElementById("confirm-purchase").disabled = true;
                } else {
                     document.getElementById("confirm-purchase").disabled = false;
                }
            },

            initSingleProductDetailsD() {
                var paymentModeType = 'default';
                var orderIdProduct = undefined;
                if (localStorage.getItem('paymentModeType')) {
                    paymentModeType = localStorage.getItem('paymentModeType');
                }
                if(localStorage.getItem('product_order')) {
                    orderIdProduct = localStorage.getItem('product_order');
                }

                this.real_amount = localStorage.getItem('product_Price');
                if(paymentModeType == "rent") {
                    this.descriptions = localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";
                    this.initHashD(orderIdProduct,this.descriptions,this.real_amount);
                } else {
                    this.actSingleProductPaymentD().then((response) => {
                        this.descriptions = localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";
                        if (localStorage.getItem('reduce_price')!="null") {
                            this.real_amount=localStorage.getItem('reduce_price');
                        }
                        this.initHashD(orderIdProduct,this.descriptions,this.real_amount);
                    },
                    (error) => {
                    }
                )}
            },

            initHashD(orderid,descriptions,real_amount) {
                // console.log("-----------------"+orderid);
                this.userEmail = localStorage.getItem('user_email');

                let usernameExtra = this.userEmail.split('@');
                this.userName = localStorage.getItem('user_name') ? localStorage.getItem('user_name') : usernameExtra[0];

                var currentHostNameSF=localStorage.getItem('currentHostNameSF');
                this.tnxno = this.createTranstionIdD(16);
                localStorage.setItem("tranId", this.tnxno);
                //this.successUrl="https://gvx62fail7.execute-api.ap-northeast-1.amazonaws.com/uat/payu?api="+location.protocol + '//' + location.host;

                this.successUrl = this.altConfigEnviroment.paymentReturnURL + "?api="+location.protocol + '//' + location.host;

                this.payUkey = this.altConfigEnviroment.payuKey;

                if(localStorage.getItem('altAccount')==="undefined" || localStorage.getItem('altAccount').phoneNumber==null) {
                    this.mobileNo = "9999999999";
                } else {
                    this.mobileNo = JSON.parse(localStorage.getItem('altAccount')).phoneNumber;
                }

                var orderData={};
                orderData.hash={
                    hashSequence:"key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10",
                    data:{
                        key:this.payUkey,
                        txnid:this.tnxno,
                        pg:"DC",
                        bankcode:"DC",
                        surl:this.successUrl,
                        furl:this.successUrl,
                        amount:this.real_amount,
                        email:this.userEmail,
                        firstname:this.userName,
                        productinfo:this.descriptions,
                    }
                };
                // console.log(orderData.hash);
                orderData.orderId = orderid;
                this.actCreateHashD(orderData).then((response) => {
                        this.setCreateHashD(response);
                    },
                    (error) => {
                        // console.log('[Subscribe | initSubscribePlan | error | ]', error);
                    })
            },
        },
        components: {
            'help-header': Header,
            'alt-modals': Modals,
            'alt-payment':payment,
        },
        created() {
            this.toggleLoader(true);
            this.initSingleProductDetailsD();
             if(navigator.userAgent.indexOf("Firefox") != -1 ) {
              this.firefox=1;
             }
        },
        mounted() {

            let config = undefined;
            config = localStorage.getItem("altConfig")  ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
            this.altConfigEnviroment = config && config.environment ? config.environment : undefined;
            this.payuURL = this.altConfigEnviroment && this.altConfigEnviroment.payuURL ? this.altConfigEnviroment.payuURL : undefined;
            // console.log("debit.vue | mounted",this.altConfigEnviroment);
        },
        mixins: [altMixins]
    }

</script>
