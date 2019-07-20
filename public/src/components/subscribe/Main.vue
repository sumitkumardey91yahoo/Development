<template>
    <div class="alt-help">
        <div class="subs-container">
            <div class="subscribe-holder">

                <div class="left-holder-desc" v-if="singleProduct">
                    <h3 class="premium-old-price" v-if="singleProduct.discount && singleProduct.discount[singleProduct.price.currency]">{{(singleProduct.price.currency == 'INR') ? '₹' : '$'}}{{singleProduct.discount[singleProduct.price.currency]}}</h3>

                    <h3 class="premium-new-price" v-if="singleProduct.price">{{(singleProduct.price.currency == 'INR') ? '₹' : '$'}}{{realAmount}}*</h3>

                    <p v-if="singleProductList" style="text-align:center;margin: 0%;">to rent <br> {{(singleProductList.product.titles.en).toUpperCase()}}</p>

                    <h3 class="premium-mnth" > {{singleProduct.titles.en}} </h3>
                </div>
                <div class="left-holder-desc" v-else>
                    <h3 class="premium-new-price" v-if="singleProductList">{{(singleProductList.price.currency == 'INR') ? '₹' : '$'}}{{rentPriceDescription}}*</h3>
                    <p style="text-align:center;margin: 0%;" v-if="singleProductList">to rent<br> {{(singleProductList.product.titles.en).toUpperCase()}}</p>

                </div>

                <div class="right-holder-desc">
                    <pre v-if="holderDescription" class="rent-Font-Title">
                        <h3>{{holderDescription}}</h3>
                    </pre>
                    <ul class="premium-list-data premium-no-bg" v-else>
                        <li class="premium-list" v-for="item in altConfig.subscriptionPage.features">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <alt-modals></alt-modals>
    </div>
</template>


<script>
const Header = () => import (/* webpackChunkName: "subscribe-Main-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "subscribe-Main-Modals" */ '../shared/Modals.vue');

// import Header from './Header.vue';
// import Modals from '../shared/Modals.vue';

import { altMixins } from '../../mixins';
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data(){
        return {
            productFeatures:undefined,
            rentPriceDescription:undefined,
            priceDescription:undefined,
            holderDescription:undefined,
            tvodPlans:undefined,
            singleProductList:undefined,
            altConfig:undefined,
            realAmount:undefined,
        }
    },

    computed: {
        ...mapGetters([
            'appActive',
            'discountData',
            'singleProduct',
            'createOrder',
            'altSubsPageMessages',

        ]),
    },
    watch: {
        appActive() {
            this.setSubscribePageHeader();
            this.initPayment();
        }
    },
    methods: {
        ...mapMutations([
            'setSingleProduct'
        ]),
        ...mapActions([
            'actSingleProduct',
            'actGetProductList',
            'actProductDetails'
        ]),
        setSubscribePageHeader() {
            this.setHeaderTitle('subscribe');
            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
        },
        initPayment() {
            this.actProductDetails().then((response) => {
                // console.log("[Main.vue|actProductDetails|]",response);
                 this.toggleLoader(true);
                if(response.price.currency == 'INR') {
                    localStorage.setItem("price_symbol",'₹');
                } else {
                    localStorage.setItem("price_symbol",'$');
                }

                var productId = response.product.id;
                this.setSingleProduct(undefined);
                if(!response.product.recurring) {
                    this.singleProductList = response;
                     // console.log("initPayment | recurring false",this.singleProductList)
                    this.rentPriceDescription = response.price.real_amount;
                    this.holderDescription = this.altSubsPageMessages.featureTvod;
                    localStorage.setItem('product-title',response.product.titles.en);
                    localStorage.setItem("product_Price", response.price.real_amount);
                    localStorage.setItem("product_discount",'');
                    this.toggleLoader(false);
                } else {
                    this.actSingleProduct().then((responseSingle) => {
                         // console.log('[Main | initPayment | responseSingle | ]', responseSingle);
                        var singlePlan = {
                            id: productId,
                        }
                        // console.log(singlePlan);
                        singlePlan.discount = this.altConfig.discountPrices[singlePlan.id];

                        if (responseSingle.count) {
                            var matchedProduct = responseSingle.products.filter((item) => {
                                return item.id == singlePlan.id;
                            });
                            if (matchedProduct && matchedProduct.length) {
                                this.setSingleProduct(this.parseProductPlans(matchedProduct[0]));
                            }
                             // console.log('[Main | initPayment | singleProduct | ]', this.singleProduct);

                             let reduce_price_refresh = undefined;
                             reduce_price_refresh = (localStorage.getItem('reduce_price') && localStorage.getItem('reduce_price') != "null") ?  localStorage.getItem('reduce_price') : undefined;
                             this.realAmount = reduce_price_refresh ? reduce_price_refresh : this.singleProduct.price.real_amount;


                            localStorage.setItem('product-title',this.singleProduct.descriptions.default);
                            localStorage.setItem("product_Price", this.singleProduct.price.real_amount);
                            localStorage.setItem("product_validation", this.singleProduct.descriptions.default);
                            localStorage.setItem("product_discount", (this.singleProduct.discount && this.singleProduct.discount[this.singleProduct.price.currency]) ? this.singleProduct.discount[this.singleProduct.price.currency] : '');
                        }
                        this.toggleLoader(false);
                    }, (error) => {
                        this.toggleLoader(false);
                        // console.log('[Subscribe | initSubscribePlan | error | ]', error);
                    });
                }
            },(error) => {
                // console.log('[Subscribe | initSubscribePlan | error | ]', error);
                this.toggleLoader(false);
            });

        },
    },
    components: {
        'help-header': Header,
        'alt-modals': Modals,
    },
    mounted() {
        this.setSubscribePageHeader();
    },
    created() {
        this.setSubscribePageHeader();
        if (this.appActive) {
            this.setSubscribePageHeader();
            this.initPayment();
        }
        if(localStorage.getItem('altConfig')) {
            this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

        eventBus.$on('toggleVoucherPrice', (state) => {
            if(state) {
                let reduce_price = undefined;
                reduce_price = (localStorage.getItem('reduce_price') && localStorage.getItem('reduce_price') != "null") ?  localStorage.getItem('reduce_price') : undefined;
                this.realAmount = reduce_price ? reduce_price : this.realAmount;
            }
        });

    },
    mixins: [altMixins]
}
</script>
