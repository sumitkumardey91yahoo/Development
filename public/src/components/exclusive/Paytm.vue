<template>
    <div class="exc-paytm-container">
        <h2><i>PAYTM TERMS AND CONDITIONS</i></h2>
        <p><i><b>Duration :12th Nov 2017 0000 hrs till Dec 31st 2017, 2400 hrs</b></i></p>
        <ul>
            <li>Get upto Rs 50 cashback on ALTBalaji using Paytm Wallet</li>
            <li>No minimum transaction amount is required </li>
            <li>Cashback can vary from Rs 20 to Rs 50</li>
            <li>Valid for 1 transaction per user during the offer period</li>
            <li>Cashback will be cancelled in case of full refunds or cancellation of orders</li>
            <li>In partial refund cases cashback will be rolled back in same proportionate amount</li>
            <li>Mobile number needs to be verified to be eligible for cash back</li>
            <li>In case of any dispute the customer needs to get in touch with the Merchant/Brand</li>
            <li>RBI mandates that upto Rs. 20,000 can be added in a month to a non-upgraded wallet. In case you breach these limits then cashback will get added to your wallet in the next calendar month. In order to allow cashback to be added earlier we urge that you request for a wallet upgrade (available under your profile).</li>
        </ul>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters([
            'appActive',
        ]),
    },
    watch: {
        appActive() {

        }
    },
    methods: {
        ...mapActions([

        ]),
    },
    created() {
    },
    mounted() {
        // console.log('[Paytm | mounted | ]');

        this.toggleLoader(false);
    },
    beforeDestroy() {

    },
    mixins: [altMixins]
}
</script>
