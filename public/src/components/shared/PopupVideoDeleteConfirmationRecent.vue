<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="popup-bg">
                    <p>Are you sure you want to delete?</p>
                    <button type="button" class="btn grad-btn btn-lg" @click="deleteVideo">YES</button>
                    <p class="link-under" @click="closePopup" >NO</p>
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
            // this.$router.push({ name: 'home' });
            eventBus.$emit('togglePopupDeleteVideoRecent', false);
            // console.log("close");
            // NOTE added by sumit for the popup position chnage 16.12.2018 fav anonumous
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        deleteVideo() {
            eventBus.$emit('popupDeleteVideoEventRecent', true);

            // NOTE added by sumit for the popup position chnage 16.12.2018 fav anonumous
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            // console.log("PopupVideoDeleteConformation|delete video");
            // eventBus.$emit('toggleVideoDelete');
            // eventBus.$emit('toggleVideoDeleteConformationPopupEvent', false);
        }
    }
}
</script>
