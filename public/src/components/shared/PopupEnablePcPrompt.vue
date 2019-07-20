<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p v-if="altMessages">{{altMessages.drmPermissionErrorMessage}}</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="takeToHome">OK</button>
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
            'altMessages',
        ]),
    },
    methods: {
        takeToHome() {
            // Set the value to true, for not displaying the popup next time
            localStorage.setItem('promptPcPlayback', JSON.stringify({ value: false }));

            // Close the popup
            eventBus.$emit('toggleEnablePcPrompt', false);
        }
    }
}
</script>
