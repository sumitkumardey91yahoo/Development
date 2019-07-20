<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-clear-dvc popup-container">
            <div class="popup-box dvc-box">
                <div class="popup-bg">
                    <div class="form-group">
                        <p v-if="altMessages">{{altMessages.deviceRegistrationError}}</p>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn grad-btn btn-sm" @click="clearDevices" id="clearDevicesButton" v-if="altMessages">{{altMessages.buttonClearDevices}}</button>
                    </div>
                    <p class="link-under" @click="closeClearDevices">CANCEL</p>
                </div>
            </div>
            <div class="alt-overlay" @click="closeClearDevices"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { store } from '../../store/store';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'user',
            'account',
            'passphrase',
            'deleteError',
            'altMessages',
        ])
    },
    methods: {
        ...mapMutations([
            'setDeleteError',
        ]),
        ...mapActions([
            'actGetDeviceList',
            'actDeleteDevice',
        ]),
        clearDevices() {
            // console.log('[ClearDevices | clearDevices | user | ]', this.user);
            // console.log('[ClearDevices | clearDevices | account | ]', this.account);

            this.actGetDeviceList(this.user).then((response) => {
                 // console.log('[clearDevices | actGetDeviceList | response | ]', response);

                // Iterate through the list of device id's and delete one by one
                // Note that this is an async loop, so when the deletion failed by throwing error messages like cannot unregister more devices, please handle it by showing the correct popup to the user
                for (var i in response.devices) {
                    this.deleteDevice(response.devices[i].id);
                }

                if(localStorage.getItem("fb")) {
                    localStorage.removeItem("fb");
                    // console.log("400");
                    eventBus.$emit("fbDeviceDelete");
                } else {
                    eventBus.$emit('postDeleteDevicesEvent');
                    eventBus.$emit('closeClearDevicesEvent');
                }
            }, (error) => {
                 // console.log('[clearDevices | actGetDeviceList | error | ]', error);

                eventBus.$emit('closeClearDevicesEvent');
                // this.toggleClearDevicealert(false);
                this.$router.push({ name: 'home' });
            });
        },
        deleteDevice(id) {
            this.actDeleteDevice({
                user: this.user,
                deviceId: id
            }).then((response) => {
                // console.log('[Login | deleteDevice | actDeleteDevice | response |]', response);

                if (response.status && response.status == 'ok') {
                    return true;
                } else {
                    return false;
                }
            }, (error) => {
                // console.log('[Login | deleteDevice | actDeleteDevice | error |]', error);

                this.setDeleteError(this.deleteError + 1);
                return false;
            });
        },
        closeClearDevices() {
            eventBus.$emit('closeClearDevicesEvent');
        },
        asyncLoop(iterations, func, callback) {
            var index = 0;
            var done = false;
            var loop = {
                next: () => {
                    if (done) return;
                    if (index < iterations) {
                        index ++;
                        func(loop);
                    } else {
                        done = false;
                        callback();
                    }
                },
                iteration: () => {
                    return index - 1;
                },
                break: () => {
                    done = true;
                    callback();
                }
            };
            loop.next();
            return loop;
        }
    },
    mixins: [altMixins]
}
</script>
