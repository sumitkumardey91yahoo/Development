<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p v-if="paymentConformation">
                        <strong>{{paymentConformation.confirmation_title}}</strong>
                    </p>
                    <p v-if="paymentConformation">{{paymentConformation.confirmation_desc}}</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="proceedPayment">PROCEED</button>
                    <p class="link-under" @click="closePopup">Cancel</p>
                     <a v-if="paymentConformation" target="_blank" class="link-under color-red" :href="paymentConformation.confirmation_link_url">{{paymentConformation.confirmation_link_title}}</a>
                </div>
            </div>
            <div class="alt-overlay"></div>
        </div>
    </div>
</template>
<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'paymentConformation',
        ])
    },
    methods: {
        closePopup() {
             // console.log('[PopupPaymentConformation | closePopup |]');
             
             if(document.getElementById('alt-app')) {
                 document.getElementById('alt-app').style.position = "relative";
             }

            eventBus.$emit('togglePopupConfirmPayment', false);
        },
        proceedPayment() {
             // console.log("popupPaymentConformation|proceedPayment");

             if(document.getElementById('alt-app')) {
                 document.getElementById('alt-app').style.position = "relative";
             }

            eventBus.$emit('proceedToPaymentEvent');
        }
    },
}
</script>
