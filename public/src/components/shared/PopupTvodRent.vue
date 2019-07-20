<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-signin popup-container">
            <div class="popup-box signin-box">
                <div class="tvod-box">
                    <div v-if="playerContent" class="tvod-img">
                        <img v-if="playerContent.images && playerContent.images.cover" :src="playerContent.images.cover" alt="tvod-image">
                    </div>
                    <div class="tvod-desc" v-if="tvodProduct">
                        <p>Get access to {{(tvodProduct.title).toUpperCase()}}! <br>at just {{tvodProduct.currency == 'INR' ? '₹' : '$'}}{{tvodProduct.price}} !!<br>Sign in to rent and watch.</p>
                        <button v-if="altMessages" type="button" class="btn grad-btn btn-lg" @click="signinAndRent">{{altMessages.buttonSignInRent}}</button>
                        <p v-if="altMessages" class="link-under" @click="closePopup">{{altMessages.buttonRentLater}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters([
            'altMessages',
            'playerContent',
            'tvodProduct',
        ]),
    },
    methods: {
        ...mapMutations([
            'setRouterToParam',
            'setRouterFromParam',
        ]),
        closePopup() {
            eventBus.$emit('toggleRentTvodItemEvent', false);
            // NOTE added by sumit for the popup position chnage 16.12.2018 fav anonumous
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        signinAndRent() {
            // console.log('[PopupTvodRent | signinAndRent | ]');
            // console.log('[PopupTvodRent | signinAndRent | route ]', this.$route);
             // console.log('[PopupTvodRent | signinAndRent | playerContent ]', this.playerContent);

            this.closePopup();

            this.setRouterFromParam(this.$route);
            
            // var seriesId = undefined;
            //  seriesId = this.playerContent.id;
            //     this.setRouterFromParam({
            //         name: 'rent',
            //         params: {
            //             type: 'show',
            //             id: seriesId,
            //             tvod:this.playerContent.tvod,
            //         },
            //         fullPath: '/show/' + seriesId,
            //         hash: '',
            //         path: '/show',
            //         query: {}
            //     });

            

      // NOTE commented by sumit for V 1.4.19--Rent button is getting displayed for subscribed user Issue #369

            // this.setRouterFromParam({
            //     name: 'rent',
            //     params: {
            //         type: 'show',
            //         id: seriesId
            //     },
            //     fullPath: '/rent/show/' + seriesId,
            //     hash: '',
            //     path: '/rent',
            //     query: {}
            // });

            // this.setRouterFromParam({
            //     name: 'rent',
            //     params: {
            //         type: 'show',
            //         id: seriesId
            //     },
            //     fullPath: '/show/' + seriesId,
            //     hash: '',
            //     path: '/show',
            //     query: {}
            // });

            // NOTE added by sumit for the popup position chnage 16.12.2018 fav anonumous
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }

            this.$router.push({ name: 'login' });
        }
    },
    created() {

    }
}
</script>
