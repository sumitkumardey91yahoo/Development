<template>
    <div>
        <div class="container">
            <div class="rent-page">
                <div class="rent-sec" v-if="rentItem && tvodPlan">
                    <div class="rent-box">
                        <p v-show="rentItem.title">RENT {{(rentItem.title).toUpperCase()}} AT</p>
                        <h4 class="text-md text-price" v-if="tvodPlan.price">{{(tvodPlan.currency == 'INR') ? '₹' : '$'}}{{tvodPlan.price}}</h4>

                        <button type="button" class="btn btn-grad btn-sm" @click="makeRentPayment">{{(altMessages.buttonRentNowMultiple).toUpperCase()}}</button>

                        <p>OR</p>
                        <p>TO GET ACCESS TO {{(rentItem.title).toUpperCase()}} AND MUCH MORE.</p>
                    </div>
                </div>
                <div class="plan-sec" v-if="productPlans">
                    <pre v-if="altSubsPageMessages" v-html="altSubsPageMessages.title" class="tvod-svod-page-title">
                    </pre>
                    <!-- <p class="p-head text-b" v-if="altSubsPageMessages" v-html="altSubsPageMessages.title"></p> -->
                    <div class="plan-list">
                        <div class="plan-list-item" v-for="(plan, index) in productPlans" @click="makePlanPayment(index)">
                            <div class="plan-list-ibox grad-bg">
                                <p class="p-head text-b plan-list-ibox-discount" v-if="plan && plan.discount && plan.discount[plan.price.currency]">
                                    <span class="plan-head-cutcur">{{(plan.price.currency == 'INR') ? '₹' : '$'}}{{plan.discount[plan.price.currency]}}</span>{{(plan.price.currency == 'INR') ? '₹' : '$'}}{{plan.price.real_amount}}
                                    <span class="plan-head-month">{{plan.descriptions.en}}</span>
                                </p>

                                <p class="p-head text-b plan-list-ibox-withoutDiscount" v-else>
                                    <span>{{(plan.price.currency == 'INR') ? '₹' : '$'}}{{plan.price.real_amount}}</span>
                                    <span class="plan-head-month">{{plan.descriptions.en}}</span>
                                </p>

                                <h4 v-if="plan.discount && plan.discount.description">{{plan.discount.description}}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="prem-sec" v-if="altSubsPageMessages">
                    <p v-show="altSubsPageMessages.featureTitle">{{altSubsPageMessages.featureTitle}}</p>
                    <div class="prem-box">
                        <ul v-if="altSubsPageMessages.features">
                            <li v-for="feature in altSubsPageMessages.features">{{feature}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            contentType: undefined,
            mediaId: undefined,
            rentItem: undefined,
            tvodPlanId: undefined,
            tvodPlan: undefined,
            productPlans: undefined,
            showCreateKidsPin: false,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'altMessages',
            'altSubsPageMessages',
        ]),
    },
    watch: {
        appActive() {
            this.initRentPlan();
        }
    },
    methods: {
        ...mapMutations([
            'setCreateOrder',
            'setSingleProduct',
        ]),
        ...mapActions([
            'actGetProductList',
            'actGetPlanProducts',
            'actGetMediaSeries',
            'actCreateOrder',
        ]),
        setRentPageHeader() {
            this.setHeaderTitle('');
            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
        },
        initRentPlan() {
            this.contentType = this.$route.params.type;
            this.contentId = this.$route.params.id;

            this.getMediaInfo();
        },
        getMediaInfo() {
             // console.log('[getMediaInfo | contentId | ]', this.contentId);
             //NOTE this use for TVOT content for redirect rent page
             localStorage.setItem("rentContentId",this.contentId);

            if (this.contentType == 'show') {
                this.actGetMediaSeries(this.contentId).then((response) => {
                    // console.log('[getMediaInfo | response | ]', response);

                    this.rentItem = this.parseContents(response);

                    // console.log('[getMediaInfo | rentItem | ]', this.rentItem);
                    // console.log('[getMediaInfo | visitedDomain | ]', localStorage.getItem('visitedDomain'));

                    if (!this.rentItem.tvod) return;
                    var homeDomain = localStorage.getItem('homeDomain');
                    this.tvodPlanId = this.rentItem.tvod[homeDomain.toLowerCase()];

                    // console.log('[getMediaInfo | tvodPlanId | ]', this.tvodPlanId);

                    var matchedTvodProducts = this.rentItem.pricing.filter((product) => {
                        return product.product_id == this.tvodPlanId;
                    });

                    // console.log('[getMediaInfo | matchedTvodProducts | ]', matchedTvodProducts);

                    if (matchedTvodProducts && matchedTvodProducts.length) {
                        var tvodItem = matchedTvodProducts[0];

                        // console.log('[RelatedSeasons | initRelatedSeasons | tvodItem | ]', tvodItem);

                        var id = tvodItem.product_id;
                        var price = tvodItem.price / 100;
                        var currency = tvodItem.currency;
                        var pricesheet_id = tvodItem.pricesheet_id;
                        var pricesheet_name = tvodItem.pricesheet_name;

                        this.tvodPlan = { id, price, currency, pricesheet_id, pricesheet_name };
                    }

                    // console.log('[RelatedSeasons | initRelatedSeasons | tvodPlan | ]', this.tvodPlan);

                    this.getProductPlans();
                }, (error) => {
                    // console.log('[getMediaInfo | error | ]', error);
                });
            }
        },
        getTvodPlan() {
            this.actGetProductList().then(
                (response) => {
                    // console.log('[Rent | initRentPlan | response | ]', response);

                    if (response.count) {
                        var tvodPlans = response.products.filter((plan) => {
                            return plan.id == this.tvodPlanId;
                        });
                        if (tvodPlans && tvodPlans.length) {
                            this.tvodPlan = this.parseProductPlans(tvodPlans[0]);
                            // console.log('[Rent | initRentPlan | tvodPlan | ]', this.tvodPlan);
                        }
                    }
                },
                (error) => {
                    // console.log('[Rent | initRentPlan | error | ]', error);

                }
            );
        },
        getProductPlans() {
            this.actGetPlanProducts().then(
                (response) => {
                    // console.log('[getProductPlans | response | ]', response);

                    if (response.count) {
                        var prodArr = new Array();
                        for (var i in response.products) {
                            prodArr.push(this.parseProductPlans(response.products[i]));
                        }

                        this.productPlans = prodArr;
                        // console.log('[getProductPlans | productPlans | ]', this.productPlans);

                        this.toggleLoader(false);
                    }
                },
                (error) => {
                    // console.log('[getProductPlans | error | ]', error);

                }
            );
        },
        makePlanPayment(index) {
            // console.log('[Rent | makePlanPayment | index | ]', index);

            this.toggleLoader(true);

            localStorage.setItem('reduce_price',null);
            localStorage.setItem('paymentModeType',"default");
            var selectedPlan = this.productPlans[index];
            localStorage.setItem('productId', this.productPlans[index].id);
            // console.log('[Rent | makePlanPayment | selectedPlan | ]', selectedPlan);

            this.actCreateOrder({
                product: selectedPlan.id,
                pricesheet_id: selectedPlan.price.pricesheet_id,
                platform: "web",
                payment_type: "payment_proxy"
            }).then(
                (response) => {
                     // console.log('[makePlanPayment | response | ]', response);

                    this.setCreateOrder(response);
                    //NOTE added sumit 11.01.2018
                   localStorage.setItem("product_order", response.id);
                    this.$router.push('/payment/gateways');
                },
                (error) => {
                    // console.log('[makePlanPayment | error | ]', error);
                }
            );
        },
        makeRentPayment() {
            // console.log('[Rent | makeRentPayment | tvodPlan | ]', this.tvodPlan);

            this.toggleLoader(true);
            localStorage.setItem('paymentModeType',"rent");
            localStorage.setItem('reduce_price',null);
            localStorage.setItem('productId', this.tvodPlan.id);

            this.actCreateOrder({
                product: this.tvodPlan.id,
                pricesheet_id: this.tvodPlan.pricesheet_id,
                platform: "web",
                payment_type: "payment_proxy"
            }).then((response) => {
                // console.log('[makePlanPayment | response | ]', response);

                this.setCreateOrder(response);
                this.setSingleProduct(this.tvodPlan);
                localStorage.setItem('product_order', response.id);
                localStorage.setItem('paymentModeType', "rent");
                this.$router.push('/payment/gateways');
            }, (error) => {
                // console.log('[makePlanPayment | error | ]', error);
            });
        },
    },
    created() {
        // console.log('[Rent | created | ]');
        // console.log('[getMediaInfo | contentType | ]', this.contentType);

        if (this.appActive) {
            // console.log('[Rent | altSubsPageMessages | ]', this.altSubsPageMessages);
            this.initRentPlan();
        }

        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;

            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });
    },
    mounted() {
        this.toggleLoader(true);

        this.setRentPageHeader();

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    components: {
    },
    mixins: [altMixins]
}
</script>
