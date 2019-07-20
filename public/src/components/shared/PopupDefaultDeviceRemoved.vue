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

export default {
    computed: {
        ...mapGetters([
            'altMessages',
        ]),
    },
    methods: {
        closePopup() {
            // console.log('[PopupKidsDvcRmv | closePopup | ]');

            eventBus.$emit('togglePopupDefaultDeviceRemoved', false);
        }
    }
}
</script>
