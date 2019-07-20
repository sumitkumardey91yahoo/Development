<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-logout popup-container">
            <div class="popup-box logout-box">
                <div class="popup-bg">
                    <div class="form-group">
                        <h3>Are you sure you want to log out?</h3>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn grad-btn btn-lg" @click="logoutUser">YES</button>
                    </div>
                    <p class="text-under" @click="closeLogoutPopup">NO</p>
                </div>
            </div>
            <div class="alt-overlay" @click="closeLogoutPopup"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';

export default {
    methods: {
        logoutUser() {
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            eventBus.$emit('logoutUserEvent');
        },
        closeLogoutPopup() {

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            eventBus.$emit('toggleLogoutPopupEvent', false);
        }
    },
}
</script>
