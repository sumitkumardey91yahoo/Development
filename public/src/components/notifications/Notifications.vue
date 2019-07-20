<template>
    <div class="alt-favourites">
        <!-- <notifications-header></notifications-header> -->
        <div class="subs-container">
            <div v-if="subscriptionNotification || tvodNotification || expiredSubscription || expiredTvod">
                <div class="notification_tab" v-if="subscriptionNotification" @click="redirect('settings')">
                    <img src="../../assets/bell.svg" class="bellNotification" alt='bellNotification'>
                    <!-- <p class="notification_body">subscription about to expire </p> -->
                    <p class="notification_body">Your subscription expires in {{subscriptionRemainDays}} days. Renew now.</p>
                </div>
                <div class="notification_tab" v-if="expiredSubscription" @click="redirect('subscribe')">
                    <img src="../../assets/bell.svg" class="bellNotification" alt='bellNotification'>
                    <p class="notification_body">Your subscription is over. Renew now</p>
                </div>
                <div class="notification_tab" v-if="expiredTvod"  @click="redirect('/rent/show/127')">
                    <img src="../../assets/bell.svg" class="bellNotification" alt='bellNotification'>
                    <p class="notification_body">rental is already expired</p>
                </div>
                <div v-for="single in tvodArrayActive" v-show="tvodArrayActive">
                    <div class="notification_tab" v-if="single.tvodNotification">
                        <img src="../../assets/bell.svg" class="bellNotification" alt='bellNotification'>
                        <p class="notification_body">Content {{single.tvodTitle}} expires in {{single.tvodDays}} days</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="no_Notification">You have no new notifications</p>
            </div>
        </div>
        <popup-notification v-show="showPopupNotification"></popup-notification>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
import { altMixins } from '../../mixins';
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const Modals = () => import (/* webpackChunkName: "notifications-Notifications-Modals" */ '../shared/Modals.vue');
const popupDeleteNotificationConfirmation = () => import(/* webpackChunkName: "favourites-Favourites-PopupVideoDeleteConformation" */ '../shared/popupDeleteNotificationConfirmation.vue');

export default {
    data() {
        return {
            showCreateKidsPin: false,
            notificationsList:undefined,
            altUser:undefined,
            subscriptionNotification:false,
            tvodNotification:false,
            expiredSubscription:false,
            expiredTvod:false,
            altMessages:undefined,
            subscribeDayExpire:0,
            todayExpire:false,
            showPopupNotificationConfirm:false,
            showPopupNotification:false,
            tvodTitle:undefined,
            tvodDays:0,
            tvodArrayActive:[],
            subscriptionRemainDays:false,
        };
    },
    computed: {
        ...mapGetters([

        ]),
    },
    watch: {

    },
    methods: {
        ...mapMutations([
            'setHideBin',
        ]),
        ...mapActions([
            'actGetOrders',
        ]),
        redirect(url) {
            this.$router.push(url);
        },
        notification() {
            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                var pageTitle = 'Notifications';
            }
            // End of AWS Mobile SDK Events

            if (localStorage.getItem('notifications')) {
                this.notificationsList=JSON.parse(localStorage.getItem('notifications'));
                // console.log(this.notificationsList);
                this.notificationsList=this.revObject(this.notificationsList);
            }
        },
        setNotificationHeader() {
            this.setHeaderTitle('Notifications');

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
        stuffCommonAttributes() {
            var localAttributeObj = {}
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
        deleteAllNotification() {
            // console.log("notifications|deleteAllNotification|true");

             localStorage.setItem("deleteNotificationNotify","on");
             localStorage.removeItem("notifications");
             location.reload();
            this.showPopupNotification = false;


        },
        processOrders(orders) {
            var orderData = new Object();
            var tvodPlans = orders.filter((order) => {
                return order.product.recurring == false;
            });

            if (tvodPlans && tvodPlans.length) {
                var hasActiveTvodPlan = false;
                var activeTvodPlanIndex = undefined;
                orderData.tvod = {};
                orderData.tvod.hasOrder = false;
                orderData.tvod.expired = true;
                var orderListTvod = [];
                for (var i in tvodPlans) {
                    var timeDiff = (new Date().getTime() - new Date(tvodPlans[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
                    if (timeDiff < 0) {
                        hasActiveTvodPlan = true;
                        activeTvodPlanIndex = i;
                        orderListTvod.push(tvodPlans[i]);
                    }
                }
                if (hasActiveTvodPlan) {
                    orderData.tvod.Data = orderListTvod;
                    orderData.tvod.hasOrder = true;
                    orderData.tvod.expired = false;
                }
            } else {
                orderData.tvod = false;
            }

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
                }
            }
            // console.log("list order:",orderData.tvod);
            if(orderData && orderData.subscription && orderData.subscription.hasOrder && !orderData.subscription.expired) {
                this.subscriptionNotification = this.tvodSvodNotification(orderData.subscription.dates.valid_to.split('+')[0]);
                this.subscriptionRemainDays = this.diffDateDay(orderData.subscription.dates.valid_to.split('+')[0]);
            } if(orderData && orderData.tvod && orderData.tvod.hasOrder && !orderData.tvod.expired) {
                var tvodNotificationFlag=undefined;
                var countTvod=0;
                for (var i in orderData.tvod.Data) {
                    // console.log("data",i);
                    this.tvodTitle = orderData.tvod.Data[i].product.titles.en;
                    this.tvodDays = this.diffDateDay(orderData.tvod.Data[i].dates.valid_to.split('+')[0]);
                    tvodNotificationFlag= this.tvodSvodNotification(orderData.tvod.Data[i].dates.valid_to.split('+')[0]);
                    if(tvodNotificationFlag == true) {
                        countTvod++;
                    }
                    this.tvodArrayActive.push({'tvodTitle':this.tvodTitle,tvodDays:this.tvodDays,tvodNotification:tvodNotificationFlag});
                }
                if(countTvod > 0) {
                    this.tvodNotification=true;
                }

                // console.log("filterData",this.tvodArrayActive);
            } if(orderData && orderData.tvod && !orderData.tvod.hasOrder && orderData.tvod.expired) {
                this.expiredTvod=false;
                //this for hide rental expire
            } if(orderData && orderData.subscription && !orderData.subscription.hasOrder && orderData.subscription.expired) {
                this.expiredSubscription=true;
            }

            var notifications = undefined;
            var email = undefined;
            if(localStorage.getItem('user_email')) {
                email = localStorage.getItem('user_email');
            }
            //if (!localStorage.getItem('notifications')) {
            notifications = {"email":email,"subscriptionNotification":this.subscriptionNotification,"expiredSubscription":this.expiredSubscription,"tvodNotification":this.tvodNotification,"expiredTvod":this.expiredTvod};
            localStorage.setItem('notifications', JSON.stringify(notifications));
            // }

            notifications = JSON.parse(localStorage.getItem('notifications'));

            // console.log(notifications);

            //assigning part
            this.subscriptionNotification = notifications.subscriptionNotification ;
            this.tvodNotification = notifications.tvodNotification;
            this.expiredTvod = notifications.expiredTvod;
            this.expiredSubscription = notifications.expiredSubscription;
            //assigin part

            //notification toggle checking

            //NOTE Commented by sumit 01/01/2018

            // if(localStorage.getItem('notificationFlag')) {
            //     var notify = localStorage.getItem('notificationFlag');
            // }
            // if(notify == "off") {
            //     this.subscriptionNotification = false ;
            //     this.tvodNotification = false;
            //     this.expiredTvod = false;
            //     this.expiredSubscription = false;
            // }

            if(!this.subscriptionNotification && !this.tvodNotification && !this.expiredSubscription && !this.expiredTvod) {
                var recentDeleteIco = document.getElementById('delete-ico');
                if (recentDeleteIco) {
                    recentDeleteIco.style.display = 'none';
                }
            } else {
                var recentDeleteIco = document.getElementById('delete-ico');
                if (recentDeleteIco) {
                    recentDeleteIco.style.display = 'inline';
                    recentDeleteIco.addEventListener("click", function(){
                    eventBus.$emit('togglePopupConfirmNotificationEvent', true);
                    });
                }
            }

            this.toggleLoader(false);

        },
        diffDateDay(Exdate){
            var date1 = new Date();
            var date2 = new Date(Exdate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return diffDays;
        },
        tvodSvodNotification(Exdate) {
            var today,someday,text;
            today = new Date();
            // console.log("current date",today);
            someday = new Date(Exdate);
            // this.subscribeDayExpire=this.diffDateDay(Exdate);
            // if(this.subscribeDayExpire == 0) {
            //     this.todayExpire=true;
            // }
            today.setDate(today.getUTCDate()+7);//before 7 days button will come
            // console.log("expired date",someday);

            if (someday <= today) {
                return true;
            } else {
                return false;
            }
        },

    },
    created() {
        // console.log('[Notification | created | ]');

        this.setNotificationHeader();

        this.toggleLoader(true);
        if(localStorage.getItem("altMessages")) {
            this.altMessages=JSON.parse(localStorage.getItem("altMessages"));
             // console.log(this.altMessages);
        }
        var delNotification=undefined;
        if (localStorage.getItem('deleteNotificationNotify')) {
            delNotification = localStorage.getItem('deleteNotificationNotify');
        }

        this.altUser= JSON.parse(localStorage.getItem('altUser'));
        if(delNotification != 'on') {
            this.actGetOrders(this.altUser).then((response) => {
                this.processOrders(response.orders);
            });
        } else {
            var recentDeleteIco = document.getElementById('delete-ico');
            if (recentDeleteIco) {
                recentDeleteIco.style.display = 'none';
            }
            this.toggleLoader(false);
        }

        eventBus.$on('togglePopupConfirmNotificationEvent', (state) => {
            // console.log('[notifications | created | togglePopupConfirmNotificationEvent | ]');
            this.showPopupNotification = state;
        });

        eventBus.$on('togglePopupDeleteNotification', (state) => {
            // console.log('[notifications | created | togglePopupDeleteNotification | ]');
            if(state) {
                this.deleteAllNotification();
            } else {
                this.showPopupNotification = state;
            }
        });



        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;
            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });
    },
    beforeDestroy() {
        eventBus.$off('togglePopupConfirmNotificationEvent');
        eventBus.$off('togglePopupDeleteNotification');
        eventBus.$off('headerHideNotificationNumber');
    },
    components: {
        'alt-modals': Modals,
        'popup-notification' : popupDeleteNotificationConfirmation
    },
    mixins: [altMixins]
}
</script>
