<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p>Are you sure you want to delete?</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="deleteVideo" style="font-size:14px">DELETE ALL NOTIFICATIONS</button>
                    <p class="link-under" @click="closePopup" >SKIP FOR NOW</p>
                </div>
            </div>
            <div class="alt-overlay"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';

export default {
    methods: {
        closePopup() {
            eventBus.$emit('togglePopupDeleteNotification', false);
        },
        deleteVideo() {
            eventBus.$emit('togglePopupDeleteNotification', true);
        }
    }
}
</script>
