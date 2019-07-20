import './assets/css/style.css';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// import App from './App.vue'

const App = () => import(/* webpackChunkName: "App-install" */ './App.vue')


import { routes } from './routes'
import { store } from './store/store'

// Vue Rouer instance
Vue.use(VueRouter)
export const router = new VueRouter({
    routes,
    // Set mode to history for removing hash from url
    mode: 'history',
    scrollBehaviour: (to, from, savedPos) => {
        return { x: 0, y: 0 };
    }
});


// Attaching vue-resource instace with vue instance
Vue.use(VueResource)

// The Global EventBus
export const eventBus = new Vue()

// The Global Filter
Vue.filter('fltr_FLCapital', (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
});
Vue.filter('fltr_JoinArrToCapital', (arr) => {
    var joinedString = '';
    for (let i in arr) {
        joinedString += arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        if (i == (arr.length - 1)) break;
        joinedString += ', ';
    }
    return joinedString;
});

// Creating vue instance
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
         // console.log('[ServiceWorker | registration | success | ]');
    }).catch(err => {
         // console.log('[ServiceWorker | registration | error | ]', err);
    });
}

var altConfig = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;

window.addEventListener('load', () => {
    console.log("main.js");
});
// Google Tag Manager (GTM)
if(altConfig && altConfig.environment && altConfig.environment.gtmID_PWA) {
    var gtmId = altConfig.environment.gtmID_PWA;
    
    // console.log("GTM serder ID",gtmId);
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',gtmId);

    console.log("one")
}


if(altConfig && altConfig.facebookID) {
    // Initializing Facebook SDK
    // appId      : '183663959035991',  //  Test credential
    window.fbAsyncInit = function() {
        FB.init({
            appId      : altConfig.facebookID,
            cookie     : true,
            xfbml      : true,
            version    : 'v2.8'
        });
        FB.AppEvents.logPageView();
    };
}

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0&appId=816133025196751";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
