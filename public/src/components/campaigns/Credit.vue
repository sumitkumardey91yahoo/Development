<template>
    <div class="alt-helpp">
        <div class="subs-container">
            
            <div class="payment">
             <h2 style="font-weight: bold; margin-bottom: 22px;
    margin-top: 10px;">Credit Card</h2>
                <form :action="payuURL" method="post" name="myform">
                    <div  id="card-number-field">
                        <input type="text"  placeholder="Card Number" id="cardNumber" class="form-ctrl-white" name="ccnum" required="" @blur="validate_creditcardnumber();" @keyup="validate_creditcardnumber();" >
                        <span v-show="cardVali">Must be a valid 15/16 digit number</span>
                    </div>
                    <div class=" owner">
                        <input type="text"  placeholder="Name of the Card" id="owner" class="form-ctrl-white" name="ccname" required="" >
                    </div>
                    <div class="form-group-60">
                        <input type="text" class="form-ctrl-white" name="ccexpmon" id="month" placeholder="MM" required=""  @blur="validate_month();" @keyup="validate_month();" maxlength="2" style="width:25%;">
                        <input type="text" class="form-ctrl-white" id="year" name="ccexpyr" placeholder="YYYY" required=""  @blur="validate_year()" @keyup="validate_year()" maxlength="4" style="width:27%;">

                        <img src="../../assets/card-back.png" class="card-back" id="cvvLogo" v-if="firefox==0">
                         <img src="../../assets/card-back.png" class="card-back" id="cvvLogo" v-else style="width:60%">
                        <div class="CVV">
                            <input type="text" class="form-ctrl-white" placeholder="cvv" id="cvv" name="ccvv" required=""  @blur="validate_cvv();" @keyup="validate_cvv();"  style="width:95%;">
                        </div>
                    </div>

                    <div class="form-group-60">
                        <span v-show="cardMonth" style="width:15%">Needs to be a numeric value, between 1 and 12.</span>
                        <span v-show="cardYear" style="padding: 0% 7%;">Must be a valid expiry year.</span>
                        <span v-show="cardCvv"> Must have a length of exactly 3/4 digits.</span>
                    </div>

                    <input type="hidden" name="key" :value="payuKey">
                    <input type="hidden" name="amount" :value="real_amount">
                    <input  type="hidden" name="txnid" :value="tnxno">
                    <input  type="hidden" name="productinfo" :value="descriptions">
                    <input type="hidden" name="firstname" :value="userName">
                    <input type="hidden" name="email" :value="userEmail">
                    <input type="hidden" name="phone" :value="mobileNo">
                    <input type="hidden" name="surl" :value="successUrl">
                    <input type="hidden" name="furl" :value="successUrl">
                    <input type="hidden" name="hash" v-if="createHash" :value="createHash.hash">
                    <input type="hidden" name="pg" value="CC">
                    <input type="hidden" name="bankcode" value="CC">
                    <br><br>
                    <div id="pay-now">
                        <button type="submit"  class="submit-btn grad-btn voucher-btn" id="confirm-purchase">PURCHASE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>


import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
    export default {
        data() {
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
                payuKey:undefined,
                altConfigEnviroment:undefined,
                payuURL:undefined,
            }
        },
        computed: {
            ...mapGetters([
                'createHash',
                'singleProductPayment'
            ]),
        },
        methods: {
            ...mapMutations([
                'setCreateHash',
                'setSingleProductPayment'
            ]),
            ...mapActions([
                'actCreateHash',
                'actSingleProductPayment'

            ]),
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
            validate_creditcardnumber() {
                if (document.myform.cardNumber.value!=="") {
                    // var re16digit = /^\d{16}$/;
                    // if (!re16digit.test(document.myform.cardNumber.value)) {
                    //     this.cardVali=1;
                    // } else {
                    //     this.cardVali=0;
                    // }

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
                if (document.myform.cvv.value!=="") {
                    // var cvv = /^\d{3}$/
                    // if (!cvv.test(document.myform.cvv.value)) {
                    //     this.cardCvv=1;
                    // } else {
                    //     this.cardCvv=0;
                    // }

                    var cvv = /^\d{3}$/
                    var cvv_four = /^\d{4}$/
                    if (cvv.test(document.myform.cvv.value) || cvv_four.test(document.myform.cvv.value)) {
                        this.cardCvv = 0;
                    } else {
                        this.cardCvv = 1;
                    }

                } else {
                    this.cardCvv=0;
                }
                if (this.cardVali || this.cardCvv || this.cardYear || this.cardMonth) {
                    document.getElementById("confirm-purchase").disabled = true;
                } else {
                    document.getElementById("confirm-purchase").disabled = false;
                }
            },

            validate_year() {
                if (document.myform.year.value!=="") {
                    var year = /^\d{4}$/
                    if (!year.test(document.myform.year.value ) || document.myform.year.value<=2016) {
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
                if (document.myform.month.value!=="") {
                    var month = /^\d{2}$/;
                    if (!month.test(document.myform.month.value)||document.myform.month.value>12){
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

            initSingleProductDetails() {
                var paymentModeType = 'default';
                var orderIdProduct = undefined;
                if (localStorage.getItem('paymentModeType')) {
                    paymentModeType = localStorage.getItem('paymentModeType');
                }
                if(localStorage.getItem('product_order')) {
                    orderIdProduct = localStorage.getItem('product_order');
                }

                this.real_amount = localStorage.getItem('product_Price');
                if (paymentModeType == "rent") {
                    this.descriptions = localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";
                    this.initHash(orderIdProduct,this.descriptions,this.real_amount);
                } else {
                    this.actSingleProductPayment().then((response) => {
                        this.descriptions = localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";
                        if (localStorage.getItem('reduce_price')!="null") {
                            this.real_amount=localStorage.getItem('reduce_price');
                        }
                        this.initHash(orderIdProduct, this.descriptions, this.real_amount);
                    }, (error) => {

                    });
                }
            },

            initHash(orderid,descriptions,real_amount) {
                // console.log("-----------------"+orderid);
                this.userEmail = localStorage.getItem('user_email');

                let usernameExtra = this.userEmail.split('@');
                this.userName = localStorage.getItem('user_name') ? localStorage.getItem('user_name') : usernameExtra[0];

                var currentHostNameSF=localStorage.getItem('currentHostNameSF');
                this.tnxno = this.createTranstionId(16);
                localStorage.setItem("tranId", this.tnxno);

                //this.successUrl="https://gvx62fail7.execute-api.ap-northeast-1.amazonaws.com/uat/payu?api="+currentHostNameSF+"#/payment-results";

                this.successUrl= this.altConfigEnviroment.paymentReturnURL + "?api="+location.protocol + '//' + location.host;
                // console.log(this.successUrl);
                if(localStorage.getItem('altAccount')==="undefined" || localStorage.getItem('altAccount').phoneNumber==null)
                {
                this.mobileNo = "9999999999";
                }
                else
                this.mobileNo = JSON.parse(localStorage.getItem('altAccount')).phoneNumber;

               // console.log(this.mobileNo+"mobile number credit +++++++++++++++++++");
               if (localStorage.getItem('homeDomain').toLowerCase() != 'row') {
                this.payuKey = "rBlbBR";
                 } else {
                  this.payuKey = "D2eVzH";
                 }

                // console.log(this.tnxno);
                var orderData = {};
                orderData.hash = {
                    hashSequence:"key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10",
                    data:{
                        key:this.payuKey,
                        txnid:this.tnxno,
                        pg:"CC",
                        bankcode:"CC",
                        surl:this.successUrl,
                        furl:this.successUrl,
                        amount:this.real_amount,
                        email:this.userEmail,
                        firstname:this.userName,
                        productinfo:this.descriptions,
                    }
                };
                orderData.orderId = orderid;
                // console.log(orderData.hash);
                this.actCreateHash(orderData).then(
                    (response) => {
                        this.setCreateHash(response);
                        // console.log("hashcode"+response.hash);
                    },
                    (error) => {
                        // console.log('[Subscribe | initSubscribePlan | error | ]', error);
                    }
                )
            },
            setSubscriptionHeader() {
                this.setHeaderTitle('');
                this.toggleSearchIco(false);
                this.toggleCloseIco(false);
                this.toggleDeleteIco(false);
                this.toggleMenuIco(false);
            },
        },
        components: {
            // 'help-header': Header,
            // 'alt-modals': Modals,
            // 'alt-payment':payment,
        },
        created() {
           this.toggleLoader(false);
           this.setSubscriptionHeader();

           if (document.getElementsByClassName('app-bar')[0])
                 document.getElementsByClassName('app-bar')[0].style.display = "none"

            let config = undefined;
            config = localStorage.getItem("altConfig")  ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
            this.altConfigEnviroment = config && config.environment ? config.environment : undefined;
            this.payuURL = this.altConfigEnviroment && this.altConfigEnviroment.payuURL ? this.altConfigEnviroment.payuURL : undefined;
            // console.log("credit.vue | created",this.altConfigEnviroment);

            this.initSingleProductDetails();
            if(navigator.userAgent.indexOf("Firefox") != -1 ) {
              this.firefox=1;
             }
             if(localStorage.getItem('homeDomain').toLowerCase() != 'row') {
                 this.payuKey = this.altConfigEnviroment.payuKey;
             } else {
                 this.payuKey = this.altConfigEnviroment.payuIntKey;
             }
          // console.log("[credits.vue|homeDomain],",localStorage.getItem('homeDomain'),this.payuKey);
        },
        mixins: [altMixins]
    }

</script>
