<template>
    <div class="subsc-container popup-welcome-page">
        <div class="color-line" style="width: 100%;"></div>
        <div class="list-table container">
            <h1 class="homeTitle">WELCOME ABOARD!</h1>
            <img :src="altConfig.welcomePage.default.url.android_phone"></img>
            <h1 class="homeSubTitle">{{altConfig.welcomePage.default.title}}</h1>
            <h2 class="homeSubTitlePart">{{altConfig.welcomePage.default.description}}</h2>
            <button type="button" class="btn grad-btn btn-lg" @click="subscribeRedirection">SUBSCRIBE NOW</button>

            <p class="link-under center-skip" @click="skipRedirection">SKIP FOR NOW</p>

        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            altConfig : undefined,
        };
    },
    computed: {
        ...mapGetters([
            'routerToParam',
            'routerFromParam',
        ]),
    },
    methods: {
        ...mapActions([
            'actAddtoFavouriteSeries',
            'actAddtoFavouriteMedia',
        ]),
        subscribeRedirection() {
            this.$router.push({ name: 'subscribe' });
        },
        skipRedirection() {
            // console.log('[WelcomePage | skipRedirection | routerFromParam ]', this.routerFromParam);

            if (this.routerFromParam) {
                if (this.routerFromParam.name == 'media' || this.routerFromParam.name == 'show' || this.routerFromParam.name == 'episode') {
                    if (this.routerFromParam.extra && this.routerFromParam.extra.name == 'player-favourite') {

                        this.addToFavourite();
                        this.$router.push(this.routerFromParam.fullPath);
                    } else {
                        this.$router.push(this.routerFromParam.fullPath);
                    }
                } else {
                    this.$router.push({ name: 'home' });
                }
            } else {
                this.$router.push({ name: 'home' });
            }
        },
        addToFavourite() {
            // console.log('[LoginForm | addToFavourite | routerFromParam | ]', this.routerFromParam);

            this.contentName = this.routerFromParam.name;
            this.favCheckId = this.routerFromParam.params.id;

            // console.log('[LoginForm | addToFavourite | favCheckId | ]', this.favCheckId);

            if (this.contentName == 'show') {
                this.actAddtoFavouriteSeries(this.favCheckId).then((response) => {
                    // console.log('[LoginForm | actAddtoFavouriteSeries | response | ]', response);

                    // this.$router.push(this.routerFromParam.fullPath);
                    // this.setRouterToParam(undefined);
                    // this.setRouterFromParam(undefined);
                }, (error) => {
                    // console.log('[LoginForm | actAddtoFavouriteSeries | error | ]', error);

                    // this.$router.push(this.routerFromParam.fullPath);
                    // this.setRouterToParam(undefined);
                    // this.setRouterFromParam(undefined);
                });
            } else {
                this.actAddtoFavouriteMedia(this.favCheckId).then((response) => {
                    // console.log('[LoginForm | actAddtoFavouriteMedia | response | ]', response);

                    // this.$router.push(this.routerFromParam.fullPath);
                    // this.setRouterToParam(undefined);
                    // this.setRouterFromParam(undefined);
                }, (error) => {
                    // console.log('[LoginForm | actAddtoFavouriteMedia | error | ]', error);

                    // this.$router.push(this.routerFromParam.fullPath);
                    // this.setRouterToParam(undefined);
                    // this.setRouterFromParam(undefined);
                });
            }
        },
    },
    created() {
        if(localStorage.getItem('altConfig')) {
            this.altConfig= JSON.parse(localStorage.getItem('altConfig'));
        }
    },
}
</script>
