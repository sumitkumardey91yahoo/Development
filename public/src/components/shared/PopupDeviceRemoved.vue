<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p v-if="altMessages">{{altMessages.deviceRemovedError}}</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="closePopup">OK</button>
                </div>
            </div>
            <div class="alt-overlay"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins';

export default {
    computed: {
        ...mapGetters([
            'altMessages',
        ]),
    },
    methods: {
        closePopup() {
            // console.log('[PopupKidsDvcRmv | closePopup | ]');

            // Show the loader
            this.toggleLoader(true);
            // Check the profile mode
            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }
            // Clear all the user dataList
            this.clearUserData();
            eventBus.$emit('toggleUserModeChange', true);

            // If the user is in kids mode
            // Change the app mode back to default
            if (altProfileMode == 'kids') {
                eventBus.$emit('toggleAppModeChangeEvent', 'default');
            }

            // console.log('[PopupKidsDvcRmv | closePopup | altProfileMode ]', altProfileMode);

            // Close the popup
            eventBus.$emit('togglePopupDeviceRemoved', false);

            // console.log('[Debug | route name ]', this.$route.name);
            // If the user is in home page
            // Redirection will not work
            // So do a window refresh
            if (this.$route.name == 'home') {
                window.location.reload();
                // and return out of method for not executing rest of the code
                return;
            }

            this.$router.push({ name: 'home' });
        }
    },
    mixins: [altMixins]
}
</script>
