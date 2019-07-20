<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p v-if="altMessages">{{faqMessage}}</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="closePopup">OK</button>
                </div>
            </div>
            <div class="alt-overlay" @click="closePopup"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'altMessages',
            'faqMessage'
        ]),
    },
    methods: {
        closePopup() {
            // console.log("first");
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
            eventBus.$emit("toggleMessageValidation",false);
        }
    }
}
</script>
