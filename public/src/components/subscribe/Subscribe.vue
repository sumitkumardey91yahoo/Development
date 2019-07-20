<template>
  <div class="alt-help">
    <div class="subs-container">
      <pre
        v-if="altSubsPageMessages"
        v-html="altSubsPageMessages.title"
        class="tvod-svod-page-title">
      </pre>
      <div
        class="plan-listr"
        v-for="(product,index) in productValue"
        @click="makePayment(index)">
        <div class="plan-list-item">
          <div class="plan-list-ibox grad-bg">
            <p class="p-head text-b plan-list-ibox-discount" v-if="product.discount && product.discount[product.productCurrency]">
              <span class="plan-head-cutcur">{{product.currency[product.productCurrency]}}{{product.discount[product.productCurrency]}}</span>{{product.currency[product.productCurrency]}}{{product.price.real_amount}}*
              <span class="plan-head-month">{{product.description.default}}</span>
            </p>
            <p class="p-head text-b plan-list-ibox-withoutDiscount" v-else>
              <span>
                {{product.currency[product.productCurrency]}}
                {{product.price.real_amount}}*
              </span>
              <span class="plan-head-month">{{product.description.default}}</span>
            </p>
            <h4 v-if="product.discount && product.discount.description">{{product.discount.description}}</h4>
          </div>
        </div>
      </div>
      <h3 style="margin-top: 30px;">ALTBalaji Premium Features</h3><br/>
      <ul class="premium-list-data_subscribe">
        <li class="premium-list" v-for="item in altConfig.subscriptionPage.features">{{item}}</li>
      </ul>
    </div>
    <alt-modals></alt-modals>
  </div>
</template>

<script>
// import { store } from '../../store/store'
// import(/* webpackChunkName: store-subscribe */  '../../store/modules/subscribe').then((data) => {
//   store.registerModule("subscribe", data);
//   console.log("store", store)
// });
const Modals = () => import (/* webpackChunkName: "subscribe-Credit-Modals" */ '../shared/Modals.vue');
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      altUserDetails:undefined,
      expiredDate:undefined,
      parent_order_id_product:undefined,
      rentOrderFlag:undefined,
      homeDomain:undefined,
      altConfig:undefined
    };
  },
  computed: {
    ...mapGetters([
    'appActive',
    'domain',
    'productValue',
    'productValueDiscount',
    'paymentPayuUrl',
    'altSubsPageMessages',
    ]),
  },
  watch: {
    appActive() {
      this.initSubscribe();
    }
  },
  methods: {
    ...mapMutations([
    'setProductValue',
    'setProductValueDiscount',
    'setSelectedProduct',
    'setCreateOrder',
    ]),
    ...mapActions([
    'actGetPlanProducts',
    'actGetPlanProductsDiscount',
    'actCreateOrder',
    'actGetOrders',
    ]),
    setSubscribePageHeader() {
      this.setHeaderTitle('subscribe');
      this.toggleSearchIco(false);
      this.toggleDeleteIco(false);
      this.toggleCloseIco(false);
    },
    getOrder() {
      // console.log('[Subscribe | getOrder | ]');

      this.actGetOrders(this.altUserDetails).then((response) => {
        if (response.count && response.orders) {
          this.expiredDate=response.orders[0].dates.valid_to;
          this.parent_order_id_product=response.orders[0].id;
          this.rentOrderFlag=response.orders[0].product.recurring;
        } else {
          return null;
        }
      }, (error) => {
        // console.log(error);
      });
    },
    makePayment(index) {
      this.toggleLoader(true);

      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }

      if (!altUser) {
        eventBus.$emit('toggleSigninPopupEvent', true);
        this.toggleLoader(false);
        return;
      }

      var timeDiff = (new Date().getTime() - new Date(this.expiredDate).getTime()) / (1000 * 3600 * 24)
      var result_expire = (timeDiff > 0) ? true : false;
      var orderData = "";

      this.setSelectedProduct( this.productValue[index] );

      localStorage.setItem('productTitle', this.productValue[index].productTitle);
      localStorage.setItem('productCurrency', this.productValue[index].productCurrency);
      localStorage.setItem('productId', this.productValue[index].id);
      localStorage.setItem('reduce_price',null);

      var productType = undefined;
      if((this.expiredDate === undefined) || (result_expire == true) || this.rentOrderFlag == false) {
        orderData = { product : this.productValue[index].id,
          pricesheet_id : 9,
          platform : "web",
          payment_type : "payment_proxy"
        };

        productType = 'Subscription';
      } else {
        var valid_from = new Date(this.expiredDate).getTime()/1000;

        orderData = { product : this.productValue[index].id,
          pricesheet_id: 9,
          platform: "web",
          payment_type: "payment_proxy",
          date_valid_from:valid_from,
          parent_order_id:this.parent_order_id_product,
        };

        productType = 'Renew';
      }

      this.actCreateOrder(orderData).then((response) => {

        // console.log("subscribe.vue |actCreateOrder ",response);

        let priceForMatrix;
        priceForMatrix = response && response.pricing &&  response.pricing.price && response.pricing.price.real_amount ? response.pricing.price.real_amount : 'N.A';
        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.product_id = orderData.product.toString();
          eventAttributeObj.product_title = localStorage.getItem('productTitle');
          eventAttributeObj.product_currency = localStorage.getItem('productCurrency');
          eventAttributeObj.product_type = productType;
          eventAttributeObj.order_id = response.id.toString();
        }
        // End of AWS Mobile SDK Events

        if (productType == 'Subscription') {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            window.mobileAnalyticsClient.recordEvent('_product.checkout', eventAttributeObj, { package_price : parseInt(priceForMatrix) });
          }
          // End of AWS Mobile SDK Events
        } else {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            window.mobileAnalyticsClient.recordEvent('_product.renew', eventAttributeObj, { package_price : parseInt(priceForMatrix) });
          }
          // End of AWS Mobile SDK Events
        }

        this.setCreateOrder(response);
        //this.toggleLoader(false);
        localStorage.setItem("product_order", response.id);
        this.$router.replace('/payment/gateways');
      },(error) => {
        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.event_action = 'error';
          eventAttributeObj.event_message = error.message ? error.message : 'N.A';
          eventAttributeObj.event_code = error.code ? error.code.toString() : 'N.A';
        }
        // End of AWS Mobile SDK Events

        if (productType == 'Subscription') {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            window.mobileAnalyticsClient.recordEvent('_product.checkout', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events
        } else {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            window.mobileAnalyticsClient.recordEvent('_product.renew', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events
        }
        this.toggleLoader(false);
        this.$router.push("login");
      });
    },
    initSubscribe() {
      var pageTitle = "Subscribe";

      this.actGetPlanProducts().then((response) => {
        if (response.count) {
          // console.log('subscribe.vue > initSubscribe > this.actGetPlanProducts',response);
          var productPlans = new Array();
          for (var i in response.products) {
            var singlePlan = {
              id : response.products[i].id ? response.products[i].id : undefined,
            }
            if (this.altConfig.discountPrices && this.altConfig.discountPrices[singlePlan.id]) {
              singlePlan.discount = this.altConfig.discountPrices[singlePlan.id];
            } else {
              singlePlan.discount = undefined;
            }

            if (response.products[i].prices && response.products[i].prices.length) {
              var matchedPrice = response.products[i].prices.filter((price) => {
                return price.domain == this.domain;
              });
              if (matchedPrice && matchedPrice.length) {
                singlePlan.price = matchedPrice[0];

              }
              singlePlan.price =response.products[i].prices[0];
              singlePlan.description = response.products[i].descriptions;
              singlePlan.currency = this.altConfig.currencies;
              singlePlan.productCurrency = response.products[i].prices[0].currency;
            }

            if (response.products[i].titles && response.products[i].titles.default) {
              singlePlan.productTitle = response.products[i].titles.default;
            }
            // console.log("singlePlan",singlePlan);
            productPlans.push(singlePlan);
          }

          // localStorage.setItem("price_symbol",productPlans[0].currency[productPlans[0].productCurrency]);
          // localStorage.setItem("product_discount",productPlans[0].discount[productPlans[0].productCurrency]);


          this.setProductValue(productPlans);
          this.toggleLoader(false);
        }
      }, (error) => {

      });
    },
    stuffCommonAttributes() {
      var localAttributeObj = {};
      var geo_location = localStorage.getItem('geo_location');
      var altConfig = JSON.parse(localStorage.getItem('altConfig'));

      if (geo_location) {
        geo_location = JSON.parse(geo_location);
        localAttributeObj = geo_location;
      }
      localAttributeObj.user_email = localStorage.getItem('user_email');
      localAttributeObj.user_id = localStorage.getItem('account_id');
      localAttributeObj.user_session = localStorage.getItem('token');
      localAttributeObj.user_name = localStorage.getItem('user_name');
      localAttributeObj.user_dob = localStorage.getItem('user_birthday');
      localAttributeObj.user_gender = localStorage.getItem('user_gender');
      localAttributeObj.app_env = altConfig.environment.title;

      return localAttributeObj;
    },
    stuffMenuSelectAttributes( sectionTitle, sectionId) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.page_title = sectionTitle;
      eventAttributeObj.section_id = sectionId.toString();

      return eventAttributeObj;
    },
    stuffPageViewAttributes( pageTitle, pageUrl) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.page_title = pageTitle;
      eventAttributeObj.page_url = pageUrl;

      return eventAttributeObj;
    },
    stuffMenuSelectAttributes( sectionTitle, sectionId) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.page_title = sectionTitle;
      eventAttributeObj.section_id = sectionId.toString();

      return eventAttributeObj;
    },
    stuffPageViewAttributes( pageTitle, pageUrl) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.page_title = pageTitle;
      eventAttributeObj.page_url = pageUrl;

      return eventAttributeObj;
    },
  },
  components: {
    'alt-modals': Modals,
  },
  created() {
    this.toggleLoader(true);

    if(localStorage.getItem('altConfig')) {
      this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
    }

    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.altUserDetails = JSON.parse(localStorage.getItem('altUser'));
    localStorage.setItem('paymentModeType',"default");
    this.homeDomain = localStorage.getItem('homeDomain');
    this.homeDomain = (this.homeDomain).toLowerCase();

    if (this.appActive) {
      this.initSubscribe();
    }

    // Code changed
    // Method for checking the renewal
    // Don't call the order details if user is anonymous
    // Code change by Sangeeth (02-01-2018)
    if (localStorage.getItem('altUser')) {
      this.getOrder();
    }
    // End of code change
  },
  mounted() {
    this.setSubscribePageHeader();
  },
  // beforeRouteEnter: (from, to, next) => {
  //   let altOrder = localStorage.getItem('altOrder');

  //   console.log('[subscribe.vue > beforeRouteEnter > altOrder]', altOrder);

  //   if (altOrder) {
  //     altOrder = JSON.parse(localStorage.getItem('altOrder'));
  //     if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder === false) {

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
