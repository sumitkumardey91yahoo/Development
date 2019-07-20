<template>
    <div class="alt-helpp">
        <div class="subs-container">
            
            <h2 style=" padding: 13px;">Netbanking</h2>
            <div class="">
                <img src="../../assets/lens.svg" class="search-header-netbanking search-input-elem search-ico" style="">
                <input type="search" id="netBankSearchInput" @keyup="myFunction" placeholder="Search Banks" class="alt-form-control search-input-elem" style="width:77%;">
                <img src="../../assets/close.svg" class="search-header-netbanking search-input-elem" @click="closeSearch" style="float: right;
                margin: auto;" v-if="crossIcon">
            </div>
            <br/>
            <li class="Netbanking_bank_list" v-show="errorBankMessage">The Bank you are looking for is not available
            </li>
            <ul id="myUL">
                <li @click="initBankPayment(bank.code)" class="Netbanking_bank_list" v-for="(bank,index) in banklist"><a>{{bank.title}}</a>
                </li>
            </ul>
            <form :action="payuURL" method="post" name="nbform" id="nbform">
                <input type="hidden" name="key" :value="payUKey">
                <input type="hidden" name="amount" :value="real_amount">
                <input type="hidden" name="txnid" :value="tnxno">
                <input type="hidden" name="productinfo" :value="descriptions">
                <input type="hidden" name="firstname" :value="userName">
                <input type="hidden" name="email" :value="userEmail">
                <input type="hidden" name="phone" :value="mobileNo">
                <input type="hidden" name="surl" :value="successUrl">
                <input type="hidden" name="furl" :value="successUrl">
                <input type="hidden" name="hash" v-if="createHash" :value="createHash.hash">
                <input type="hidden" name="pg" value="NB">
                <input type="hidden" name="bankcode" :value="bankcode">
            </form>
        </div>
    </div>
</template>
<script>
// const Header = () => import (/* webpackChunkName: "subscribe-Credit-Header" */ './Header.vue');
// const Modals = () => import (/* webpackChunkName: "subscribe-Credit-Modals" */ '../shared/Modals.vue');
// const payment = () => import (/* webpackChunkName: "subscribe-Credit-payment" */ './Main.vue');

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
                bankcode:undefined,
                bankApiList:undefined,
                errorBankMessage :undefined,
                crossIcon :false,
                altConfigEnviroment:undefined,
                payUKey:undefined,
                payuURL:undefined,
            }
        },
        computed: {
            ...mapGetters([
                'appActive',
                'banklist',
                'createHash',
                'singleProductPayment',
            ]),
        },
        methods: {
             ...mapMutations([
                 'setBankList',
                 'setCreateHash',
                 'setSingleProductPayment',
             ]),
             ...mapActions([
                 'actBankList',
                 'actCreateHash',
                 'actSingleProductPayment',
             ]),
             initBankPayment(bankCodeDetails) {
                 this.bankcode=bankCodeDetails;
                 this.initSingleProductDetails();
             },
             closeSearch() {
             document.getElementById("netBankSearchInput").value="";
             this.errorBankMessage=false;
             this.crossIcon=false;
             this.myFunction();
             },
             myFunction(event) {
                 this.errorBankMessage=false;
                 var input, filter, ul, li, a, i,count=0;
                 input = document.getElementById("netBankSearchInput");
                 filter = input.value.toUpperCase();
                 ul = document.getElementById("myUL");
                 li = ul.getElementsByTagName("li");
                 for (i = 0; i < li.length; i++) {
                     a = li[i].getElementsByTagName("a")[0];
                     if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                         count=1;
                         li[i].style.display = "";
                     } else {
                         li[i].style.display = "none";
                     }
                 }
                 if(count==0) {
                    this.errorBankMessage="true";
                 }
                 if (event && event.keyCode == 13) {
                     // console.log("Netbanking.vue|readInput",event.keyCode);
                     document.getElementById("netBankSearchInput").blur();
                 }
                 // console.log(document.getElementById("netBankSearchInput").value.length);
                 if(document.getElementById("netBankSearchInput").value.length==0) {
                     this.crossIcon=false;
                 } else {
                     this.crossIcon=true;
                 }
             },
             initHash(orderid,descriptions,real_amount) {
                 this.userEmail = localStorage.getItem('user_email');
                 this.userName = localStorage.getItem('user_name');
                 var currentHostNameSF=localStorage.getItem('currentHostNameSF');
                 this.tnxno = this.createTranstionId(16);
                 localStorage.setItem("tranId", this.tnxno);

                 this.payUKey = this.altConfigEnviroment.payuKey;

                 this.successUrl = this.altConfigEnviroment.paymentReturnURL +"?api="+location.protocol + '//' + location.host;
                 if(localStorage.getItem('altAccount')==="undefined" || localStorage.getItem('altAccount').phoneNumber==null)
                 {
                     this.mobileNo="9999999999";
                 } else {
                     this.mobileNo=JSON.parse(localStorage.getItem('altAccount')).phoneNumber;
                 }
                 var orderData={};
                 orderData.hash={
                     hashSequence:"key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10",
                     data:{
                         key:this.payUKey,
                         txnid:this.tnxno,
                         pg:"NB",
                         bankcode:this.bankcode,
                         surl:this.successUrl,
                         furl:this.successUrl,
                         amount:this.real_amount,
                         email:this.userEmail,
                         firstname:this.userName,
                         productinfo:this.descriptions,
                     }
                 };
                 orderData.orderId=orderid;
                 this.actCreateHash(orderData).then(
                 (response) => {
                     this.setCreateHash(response);
                      this.toggleLoader(true);
                     setTimeout(function(){  document.nbform.submit(); }, 2000);
                 },
                 (error) => {
                     // console.log('[Subscribe | initSubscribePlan | error | ]', error);
                 }
                 )
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
                 if(paymentModeType == "rent") {
                     this.descriptions = localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";
                     this.initHash(orderIdProduct,this.descriptions,this.real_amount);
                 } else {
                     this.actSingleProductPayment().then((response) => {
                         this.descriptions = localStorage.getItem('product-title') ? localStorage.getItem('product-title') : "description";
                         if(localStorage.getItem('reduce_price')!="null"){
                             this.real_amount=localStorage.getItem('reduce_price');
                         }
                         this.initHash(orderIdProduct,this.descriptions,this.real_amount);
                     },
                     (error) => {
                     }
                 )}
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
                 setSubscriptionHeader() {
                      this.setHeaderTitle('subscribe');
                    this.toggleSearchIco(false);
                    this.toggleCloseIco(false);
                    this.toggleDeleteIco(false);
                    this.toggleMenuIco(false);
                 }
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
            // console.log("Netbanking.vue | mounted",this.altConfigEnviroment);


            this.bankApiList={ "gateways": [ { "code": "AXIB", "title": "AXIS Bank NetBanking" }, { "code": "BBCB", "title": "Bank of Baroda - Corporate Banking" }, { "code": "BBRB", "title": "Bank of Baroda - Retail Banking" }, { "code": "BOIB", "title": "Bank of India" }, { "code": "BOMB", "title": "Bank of Maharashtra" }, { "code": "CABB", "title": "Canara Bank" }, { "code": "CITNB", "title": "Citibank Netbanking" }, { "code": "CRPB", "title": "Corporation Bank" }, { "code": "DSHB", "title": "Deutsche Bank" }, { "code": "FEDB", "title": "Federal Bank" }, { "code": "HDFB", "title": "HDFC Bank" }, { "code": "ICIB", "title": "ICICI Netbanking" }, { "code": "INOB", "title": "Indian Overseas Bank" }, { "code": "INIB", "title": "IndusInd Bank" }, { "code": "IDBB", "title": "Industrial Development Bank of India" }, { "code": "JAKB", "title": "Jammu and Kashmir Bank" }, { "code": "KRKB", "title": "Karnataka Bank" }, { "code": "KRVB", "title": "Karur Vysya " }, { "code": "SOIB", "title": "South Indian Bank" }, { "code": "SBBJB", "title": "State Bank of Bikaner and Jaipur" }, { "code": "SBHB", "title": "State Bank of Hyderabad" }, { "code": "SBIB", "title": "State Bank of India" }, { "code": "SBMB", "title": "State Bank of Mysore" }, { "code": "SBTB", "title": "State Bank of Travancore" }, { "code": "UBIB", "title": "Union Bank of India" }, { "code": "UNIB", "title": "United Bank Of India" }, { "code": "VJYB", "title": "Vijaya Bank" }, { "code": "YESB", "title": "Yes Bank" } ] };

            this.setBankList(this.bankApiList.gateways)

        },
        mixins: [altMixins]
    }

</script>
