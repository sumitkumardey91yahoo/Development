import Vue from 'vue';

// import Home from './components/home/Home.vue'
// import Reviews from './components/player/Reviews.vue'

const Home = (resolve) => {
    require.ensure(['./components/home/Home.vue'], () => {
        resolve(require('./components/home/Home.vue'))
    }, 'Route-Home');
};


const Reviews = (resolve) => {
    require.ensure(['./components/player/Reviews.vue'], () => {
        resolve(require('./components/player/Reviews.vue'))
    }, 'Route-Reviews');
};

// const Home = () => (/* webpackChunkName: "Router-Home"*/ './components/home/Home.vue' );

// const Home = () => (/* webpackChunkName: "Router-Review"*/ './components/player/Reviews.vue' );


const Login = (resolve) => {
    require.ensure(['./components/login/Login.vue'], () => {
        resolve(require('./components/login/Login.vue'))
    }, 'Route-login');
};
const Signup = (resolve) => {
    require.ensure(['./components/signup/Signup.vue'], () => {
        resolve(require('./components/signup/Signup.vue'))
    }, 'Route-signup');
};
const Player = (resolve) => {
    require.ensure(['./components/player/Player.vue'], () => {
        resolve(require('./components/player/Player.vue'))
    }, 'Route-player');
};
const Settings = (resolve) => {
    require.ensure(['./components/settings/Settings.vue'], () => {
        resolve(require('./components/settings/Settings.vue'))
    }, 'Route-settings');
};
const Notifications = (resolve) => {
    require.ensure(['./components/notifications/Notifications.vue'], () => {
        resolve(require('./components/notifications/Notifications.vue'))
    }, 'Route-notifications');
};
const RecentlyWatched = (resolve) => {
    require.ensure(['./components/recently-watched/RecentlyWatched.vue'], () => {
        resolve(require('./components/recently-watched/RecentlyWatched.vue'))
    }, 'Route-recently-watched');
};
const Favourites = (resolve) => {
    require.ensure(['./components/favourites/Favourites.vue'], () => {
        resolve(require('./components/favourites/Favourites.vue'))
    }, 'Route-favourites');
};
const Kids = (resolve) => {
    require.ensure(['./components/kids/Kids.vue'], () => {
        resolve(require('./components/kids/Kids.vue'))
    }, 'Route-kids');
};
const KidsDetails = (resolve) => {
    require.ensure(['./components/kids-details/KidsDetails.vue'], () => {
        resolve(require('./components/kids-details/KidsDetails.vue'))
    }, 'Route-kids-details');
};
const KidsPlayer = (resolve) => {
    require.ensure(['./components/kids-player/Player.vue'], () => {
        resolve(require('./components/kids-player/Player.vue'))
    }, 'Route-kids-player');
};
const Help = (resolve) => {
    require.ensure(['./components/help/Help.vue'], () => {
        resolve(require('./components/help/Help.vue'))
    }, 'Route-help');
};
const About = (resolve) => {
    require.ensure(['./components/About/About.vue'], () => {
        resolve(require('./components/About/About.vue'))
    }, 'Route-About');
};
const Subscribe = (resolve) => {
    require.ensure(['./components/subscribe/Subscribe.vue'], () => {
        resolve(require('./components/subscribe/Subscribe.vue'))
    }, 'Route-subscribe');
};
const Subscription = (resolve) => {
    require.ensure(['./components/subscription/Subscription.vue'], () => {
        resolve(require('./components/subscription/Subscription.vue'))
    }, 'Route-subscription');
};
const HelpMain = (resolve) => {
    require.ensure(['./components/help/Main.vue'], () => {
        resolve(require('./components/help/Main.vue'))
    }, 'Route-help-main');
};
const HelpFaqs = (resolve) => {
    require.ensure(['./components/help/Faqs.vue'], () => {
        resolve(require('./components/help/Faqs.vue'))
    }, 'Route-help-faqs');
};
const SendQuestion = (resolve) => {
    require.ensure(['./components/help/Question.vue'], () => {
        resolve(require('./components/help/Question.vue'))
    }, 'Route-help-send-question');
};
const Payment = (resolve) => {
    require.ensure(['./components/subscribe/Payment.vue'], () => {
        resolve(require('./components/subscribe/Payment.vue'))
    }, 'Route-payment');
};
const Credit = (resolve) => {
    require.ensure(['./components/subscribe/Credit.vue'], () => {
        resolve(require('./components/subscribe/Credit.vue'))
    }, 'Route-paymentcredit');
};
const Debit = (resolve) => {
    require.ensure(['./components/subscribe/Debit.vue'], () => {
        resolve(require('./components/subscribe/Debit.vue'))
    }, 'Route-paymentdebit');
};
const Netbanking = (resolve) => {
    require.ensure(['./components/subscribe/Netbanking.vue'], () => {
        resolve(require('./components/subscribe/Netbanking.vue'))
    }, 'Route-paymentnetbanking');
};
const Gateways = (resolve) => {
    require.ensure(['./components/subscribe/Gateways.vue'], () => {
        resolve(require('./components/subscribe/Gateways.vue'))
    }, 'Route-paymentgateways');
};
const payment_results = (resolve) => {
    require.ensure(['./components/payment-results/payment-results.vue'], () => {
        resolve(require('./components/payment-results/payment-results.vue'))
    }, 'Route-payment-results');
};
const payment_results_wallet = (resolve) => {
    require.ensure(['./components/payment-results/payment_results_wallet.vue'], () => {
        resolve(require('./components/payment-results/payment_results_wallet.vue'))
    }, 'Route-payment_results_wallet');
};
const payment_results_voucher = (resolve) => {
    require.ensure(['./components/payment-results/payment_results_voucher.vue'], () => {
        resolve(require('./components/payment-results/payment_results_voucher.vue'))
    }, 'Route-payment_results_voucher');
};
const Main = (resolve) => {
    require.ensure(['./components/subscribe/Main.vue'], () => {
        resolve(require('./components/subscribe/Main.vue'))
    }, 'Route-subscribe-main');
};
const Toc = (resolve) => {
    require.ensure(['./components/toc/Toc.vue'], () => {
        resolve(require('./components/toc/Toc.vue'))
    }, 'Route-toc');
};
const PrivacyPolicy = (resolve) => {
    require.ensure(['./components/privacy-policy/PrivacyPolicy.vue'], () => {
        resolve(require('./components/privacy-policy/PrivacyPolicy.vue'))
    }, 'Route-privacy-policy');
};
const ResetPassword = (resolve) => {
    require.ensure(['./components/reset-password/ResetPassword.vue'], () => {
        resolve(require('./components/reset-password/ResetPassword.vue'))
    }, 'Route-reset-password');
};
const Rent = (resolve) => {
    require.ensure(['./components/rent/Rent.vue'], () => {
        resolve(require('./components/rent/Rent.vue'))
    }, 'Route-rent');
};
const Activate = (resolve) => {
    require.ensure(['./components/activate/Activate.vue'], () => {
        resolve(require('./components/activate/Activate.vue'))
    }, 'Route-activate');
};
const Exclusive = (resolve) => {
    require.ensure(['./components/exclusive/Exclusive.vue'], () => {
        resolve(require('./components/exclusive/Exclusive.vue'))
    }, 'Route-exclusive');
};
const ExclusivePaytm = (resolve) => {
    require.ensure(['./components/exclusive/Paytm.vue'], () => {
        resolve(require('./components/exclusive/Paytm.vue'))
    }, 'Route-exclusive-paytm');
};

const LanguageFilterPage = (resolve) => {
    require.ensure(['./components/settings/languageFilterPage.vue'], () => {
        resolve(require('./components/settings/languageFilterPage.vue'))
    }, 'Route-languageFilterPage');
};

const paytmCampaignLogin = (resolve) => {
    require.ensure(['./components/promo/paytmCampaignLogin.vue'], () => {
        resolve(require('./components/promo/paytmCampaignLogin.vue'))
    }, 'Route-PaytmCampaignLogin');
}

const revexCampaignWoohoo = (resolve) => {
    require.ensure(['./components/campaigns/revexCampaignWoohoo.vue'], () => {
        resolve(require('./components/campaigns/revexCampaignWoohoo.vue'))
    }, 'Route-revexCampaignWoohoo');
}

const revexPaymentPage = (resolve) => {
    require.ensure(['./components/campaigns/revexPaymentPage.vue'], () => {
        resolve(require('./components/campaigns/revexPaymentPage.vue'))
    }, 'Route-revexPaymentPage');
}



const revxCampaignLogin = (resolve) => {
    require.ensure(['./components/campaigns/revexCampaignLogin.vue'], () => {
        resolve(require('./components/campaigns/revexCampaignLogin.vue'))
    }, 'Route-campaigns-RevexCampaignLogin');
}

const revxCredit = (resolve) => {
    require.ensure(['./components/campaigns/credit.vue'], () => {
        resolve(require('./components/campaigns/credit.vue'))
    }, 'Route-campaigns-credit');
}

const revxDebit = (resolve) => {
    require.ensure(['./components/campaigns/debit.vue'], () => {
        resolve(require('./components/campaigns/debit.vue'))
    }, 'Route-campaigns-debit');
}

const revxNetbanking = (resolve) => {
    require.ensure(['./components/campaigns/netbanking.vue'], () => {
        resolve(require('./components/campaigns/netbanking.vue'))
    }, 'Route-campaigns-netbanking');
}

const mainPaymentOption = (resolve) => {
    require.ensure(['./components/promo/mainPaymentOption.vue'], () => {
        resolve(require('./components/promo/mainPaymentOption.vue'))
    }, 'Route-promo-mainPaymentOption');
}

const promotionalLadingPage = (resolve) => {
    require.ensure(['./components/promotional/promotionalLandingPage.vue'], () => {
        resolve(require('./components/promotional/promotionalLandingPage.vue'))
    }, 'Router-promotional-landing-page')
} 


const promotionalWoohooPage = (resolve) => {
    require.ensure(['./components/promotional/promotionalWoohoo.vue'], () => {
        resolve(require('./components/promotional/promotionalWoohoo.vue'))
    }, 'Router-promotional-woohoo-page')
} 




export const routes = [
    {
        name: 'home',
        path: '/',
        component: Home,
    },
    {
        name: 'shows',
        path: '/shows',
        component: Home,
    },
    {
        name: 'movies',
        path: '/movies',
        component: Home,
    },
    {
        name: 'kids',
        path: '/kids',
        component: Home,
    },
    {
        name: 'comedy',
        path: '/comedy',
        component: Home,
    },
    {
        name: 'bcl',
        path: '/bcl',
        component: Home,
    },
    {
        name: 'show',
        path: '/show/:id',
        component: Player
    },
    {
        name: 'tv-shows',
        path: '/tv-shows',
        component: Home,
    },
    {
        name: 'initiatives',
        path: '/initiatives',
        component: Home,
    },
    {
        name: 'originals',
        path: '/originals',
        component: Home,
    },
    {
        name: 'media',
        path: '/media/:id',
        component: Player
    },
    {
        name: 'episode',
        path: '/episode/:id',
        component: Player
    },
    {
        name: 'reviews',
        path: '/reviews/:type/:title/:id',
        component: Reviews
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'notifications',
        path: '/notifications',
        component: Notifications
    },
    {
        name: 'favourites',
        path: '/favourites',
        component: Favourites,
    },
    {
        name: 'recently-watched',
        path: '/recently-watched',
        component: RecentlyWatched,
    },
    {
        name: 'settings',
        path: '/settings',
        component: Settings,
    },
    {
        name: 'player',
        path: '/player',
        component: Player
    },
    {
        name: 'signup',
        path: '/signup',
        component: Signup
    },
    {
        name: 'kidsMode',
        path: '/kids',
        components: {
            routerKids: Kids
        }
    },
    {
        path: '/help',
        component: Help,
        children: [
            {
                name: 'help',
                path: '',
                component: HelpMain
            },
            {
                name: 'helpFaqs',
                path: '/help/faqs/:id',
                component: HelpFaqs
            },
            {
                name: 'sendQuestion',
                path: '/help/send-question',
                component: SendQuestion
            }
        ]
    },
    {
        name: 'about',
        path: '/about',
        component: About
    },
    {
        name: 'kidsPlayer',
        path: '/kids-player/:type/:id',
        components: {
            routerKids: KidsPlayer
        }
    },
    {
        name: 'kidsDetails',
        path: '/kids-details',
        components: {
            routerKids: KidsDetails
        }
    },
    {
        name: 'subscribe',
        path: '/subscribe',
        component: Subscribe,

    },
    {
        name: 'payment',
        path: '/payment',
        component: Payment,
        children: [
            {
                name: 'main',
                path: '/',
                component: Main
            },
            {
                name: 'credit',
                path: 'credit',
                component: Credit
            },
            {
                name: 'debit',
                path: 'debit',
                component: Debit
            },
            {
                name: 'gateways',
                path: 'gateways',
                component: Gateways
            },
            {
                name: 'netbanking',
                path: 'netbanking',
                component: Netbanking
            },

        ]
    },
    {
        name: 'subscription',
        path: '/subscription',
        component: Subscription
    },
    {
        name: 'toc',
        path: '/termsofUse',
        component: Toc
    },
    {
        name: 'privacyPolicy',
        path: '/privacy-policy',
        component: PrivacyPolicy
    },
    {
        name: 'resetPassword',
        path: '/reset-password',
        component: ResetPassword
    },
    {
        name: 'payment-results',
        path: '/payment-results',
        component: payment_results

    },
     {
        name: 'payment_results_wallet',
        path: '/payment_results_wallet',
        component: payment_results_wallet

    },
    {
        name: 'payment_results_voucher',
        path: '/payment_results_voucher',
        component: payment_results_voucher

    },
    {
        name: 'rent',
        path: '/rent/:type/:id',
        component: Rent
    },
    {
        name: 'activate',
        path: '/activate/:token',
        component: Activate
    },
    {
        path: '/exclusive',
        component: Exclusive,
        children: [{
            name: 'exclusivePaytm',
            path: '/exclusive/paytm-tc',
            component: ExclusivePaytm
        }]
    },
    {
        name: 'languageFilterPage',
        path: '/regional-language',
        component: LanguageFilterPage

    },
    {   name: 'paytmCampaignLogin',
        path: '/promo',
        component: paytmCampaignLogin
    },
    {   name: 'revexCampaignWoohoo',
        path: '/paymentStatus',
        component: revexCampaignWoohoo
    },
    {   name: 'paymentPage',
        path: '/paymentOptions',
        component: revexPaymentPage,
        children: [
        ]
    },
    {
        name: 'revxDebit',
        path: '/paymentOptions/debit',
        component: revxDebit
    },
    {
        name: 'revxNetbanking',
        path: '/paymentOptions/netbanking',
        component: revxNetbanking
    },
    {
        name: 'revxCredit',
        path: '/paymentOptions/credit',
        component: revxCredit
    },
    {  
        name: 'revxCampaignLogin',
        path: '/campaign',
        component: revxCampaignLogin
    },
    {
        name: 'promotionalLadingPage',
        path: '/promotion',
        component: promotionalLadingPage
    },
    {
        name: 'promotionalWoohooPage',
        path: '/promotion/paymentStatus',
        component: promotionalWoohooPage
    }    
]
