
// console.log("paytm js");

import Vue from 'vue'
import { altMixins } from '../../mixins';

const state = {};

const getters = {};

const mutations = {};

const actions = {
    actPaytmLogin : (context,header) => {
        var syndicationURL = context.getters.syndicationUrl;
        if (!syndicationURL) {
            let syndicationURLData = localStorage.getItem('selectedGateway') ? JSON.parse(localStorage.getItem('selectedGateway')) : undefined;
            syndicationURL = syndicationURLData.syndicationURL ;
        }
        let signedHeader = header.headerData.signedHeader;
        let partner_id = header.headerData.auth.partner_id;
        let partner_password = header.headerData.auth.partner_password;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        return new Promise((resolve,reject) => {
            Vue.http.post( syndicationURL + '/accounts/login',header.data,{
                headers: {
                    'X-Dpp-SignedHeaders' : signedHeader,
                    'X-Dpp-Date' : header.timestamp,
                    Authorization : 'Basic' +' '+ window.btoa(partner_id + ':' + partner_password)
                },
                params: {
                    'domain':homeDomain
                }
            }).then(
                (response) => {
                    if (response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actPaytmLogin]');
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )}
        )},
        actPaytmSignup : (context,header) => {
            var syndicationURL = context.getters.syndicationUrl;
            if (!syndicationURL) {
                let syndicationURLData = localStorage.getItem('selectedGateway') ? JSON.parse(localStorage.getItem('selectedGateway')) : undefined;
                syndicationURL = syndicationURLData.syndicationURL ;
            }

            let signedHeader = header.headerData.signedHeader;
            let partner_id = header.headerData.auth.partner_id;
            let partner_password = header.headerData.auth.partner_password;

            var homeDomain = undefined;
            if (localStorage.getItem('homeDomain')) {
                homeDomain = localStorage.getItem('homeDomain');
            }
            return new Promise((resolve,reject) => {
                Vue.http.post( syndicationURL + '/accounts',header.data,{
                    headers: {
                        'X-Dpp-SignedHeaders' : signedHeader,
                        'X-Dpp-Date' : header.timestamp,
                        Authorization : 'Basic' +' '+ window.btoa(partner_id + ':' + partner_password)
                    },
                    params: {
                        'domain' : homeDomain
                    }
                }).then(
                    (response) => {
                        if (response.status == 201) {
                            resolve(response.body);
                        } else {
                            resolve(response.body);
                        }
                    },
                    (error) => {
                        reject(error.body);
                    }
                )}
            )},
        /**
        * Gets the list of devices
        */
        actPaytmGetDeviceList : (context, user) => {
            var syndicationURL = context.getters.baseUrl;
            var timestamp = altMixins.methods.getTimestamp();

            var homeDomain = undefined;
            if (localStorage.getItem('homeDomain')) {
                homeDomain = localStorage.getItem('homeDomain');
            }

            return new Promise((resolve, reject) => {
                if (user) {
                    var sessionToken = user.sessionToken;
                } else {
                    reject({ error: true, message: 'user object not available' })
                }

                Vue.http.get(syndicationURL + '/accounts/devices', {
                    params: {
                        domain : homeDomain
                    },
                    headers: {
                        XSSESSION: sessionToken,
                    }
                }).then((response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'error in getting device list' });
                    }
                },
                (error) => {
                    reject({ error: true, message: 'error in getting device list' });
                }
            )
        })
    },
    /**
    * Register device
    */
    actPaytmRegisterDevice : (context, registerObj) => {
        var syndicationURL = context.getters.baseUrl;
        var user = registerObj.user;
        var deviceId = registerObj.deviceId;
        var altDeviceName = localStorage.getItem('altDeviceName');

        let body_data = {
            uuid: deviceId,
            name: altDeviceName
        };

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }

        return new Promise((resolve, reject) => {
            if (user) {
                var sessionToken = user.sessionToken;
            } else {
                reject({ error: true, message: 'user object not available' })
            }
            if (!(deviceId)) {
                reject({ error: true, message: 'Device ID not available' })
            }

            Vue.http.post(syndicationURL + '/accounts/devices',body_data,{
                params: {
                    domain : homeDomain
                },
                headers: {
                    XSSESSION: sessionToken,
                }
            }).then((response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        })
    },
    actPaytmDeleteDevice : (context, deleteObj) => {
        var user = deleteObj.user;
        var deviceId = deleteObj.deviceId;
        var syndicationURL = context.getters.baseUrl;

        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }
        return new Promise((resolve, reject) => {
            if (user) {
                var sessionToken = user.sessionToken;
            } else {
                reject({ error: true, message: 'user object not available' })
            }
            if (!(deviceId)) {
                reject({ error: true, message: 'deviceId empty' })
            }

            Vue.http.delete(syndicationURL + '/accounts/devices/' + deviceId,{
                params: {
                    domain : homeDomain
                },
                headers: {
                    XSSESSION: sessionToken
                }
            }).then((response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject({ error: true, message: 'error in getting device list' });
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    })
},
actPaytmHasCodeFeatures: (context,data) => {

    var baseUrl = context.getters.baseUrl;
    var paymentProxyUrl = context.getters.paymentProxyUrl;

    var homeDomain = undefined;
    if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
    }

    var user = JSON.parse(localStorage.getItem('altUser'));
    var paymentPayUrl=localStorage.getItem('paymentProxyURL');

    var resultUrl=location.protocol + '//' + location.host+'/paymentStatus/';

    // console.log(data.dataH);
    return new Promise((resolve, reject) => {
        Vue.http.post(paymentProxyUrl + 'payment/paytm/generatehash', data.dataH, {
            params: {
                domain: homeDomain,
                orderid: data.orderId,
                notification_url: resultUrl,
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject('[actGetSections response] Error');
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    });
},
actMobikwikHasCodeFeatures: (context,data) => {
    var baseUrl = context.getters.baseUrl;
    var paymentProxyUrl = context.getters.paymentProxyUrl;

    var homeDomain = undefined;
    if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
    }

    var user = JSON.parse(localStorage.getItem('altUser'));
    var paymentPayUrl=localStorage.getItem('paymentProxyURL');

    var resultUrl=location.protocol + '//' + location.host+'/paymentStatus/';

     // console.log(data.dataH);
    return new Promise((resolve, reject) => {
        Vue.http.post(paymentProxyUrl + 'payment/mobikwik/generatehash', data.dataH, {
            params: {
                domain: homeDomain,
                orderid: data.orderId,
                notification_url: resultUrl,
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject('[actGetSections response] Error');
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    });
},
actFreechargeHasCodeFeatures: (context,data) => {
    var baseUrl = context.getters.baseUrl;
    var paymentProxyUrl = context.getters.paymentProxyUrl;

    var homeDomain = undefined;
    if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
    }

    var user = JSON.parse(localStorage.getItem('altUser'));
    var paymentPayUrl = localStorage.getItem('paymentProxyURL');

    var resultUrl = location.protocol + '//' + location.host+'/paymentStatus/';

    return new Promise((resolve, reject) => {
        Vue.http.post(paymentProxyUrl + 'payment/freecharge/generatehash', data.dataH, {
            params: {
                domain: homeDomain,
                orderid: data.orderId,
                notification_url: resultUrl,
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject('[actGetSections response] Error');
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    });
},
actAirtel_moneyHasCodeFeatures: (context,data) => {
    var baseUrl = context.getters.baseUrl;
    var paymentProxyUrl = context.getters.paymentProxyUrl;

    var homeDomain = undefined;
    if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
    }

    var user = JSON.parse(localStorage.getItem('altUser'));
    var paymentPayUrl=localStorage.getItem('paymentProxyURL');

    var resultUrl = location.protocol + '//' + location.host+'/paymentStatus/';

    return new Promise((resolve, reject) => {
        Vue.http.post(paymentProxyUrl + 'payment/airtel/generatehash', data.dataH, {
            params: {
                domain: homeDomain,
                orderid: data.orderId,
                notification_url: resultUrl,
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject('[actGetSections response] Error');
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    });
},
actOla_moneyHasCodeFeatures: (context,data) => {
    var baseUrl = context.getters.baseUrl;
    var paymentProxyUrl = context.getters.paymentProxyUrl;

    var homeDomain = undefined;
    if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
    }

    var user = JSON.parse(localStorage.getItem('altUser'));
    var paymentPayUrl=localStorage.getItem('paymentProxyURL');

    var resultUrl = location.protocol + '//' + location.host+'/paymentStatus/';

    return new Promise((resolve, reject) => {
        Vue.http.post(paymentProxyUrl + 'payment/olamoney/generatehash', data.dataH, {
            params: {
                domain: homeDomain,
                orderid: data.orderId,
                notification_url: resultUrl,
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject('[actGetSections response] Error');
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    });
},
actOxigenHasCodeFeatures: (context,data) => {
    var baseUrl = context.getters.baseUrl;
    var paymentProxyUrl = context.getters.paymentProxyUrl;

    var homeDomain = undefined;
    if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
    }

    var user = JSON.parse(localStorage.getItem('altUser'));
    var paymentPayUrl=localStorage.getItem('paymentProxyURL');

    var resultUrl=location.protocol + '//' + location.host+'/paymentStatus/';

    return new Promise((resolve, reject) => {
        Vue.http.post(paymentProxyUrl + 'payment/oxigen/generatehash', data.dataH, {
            params: {
                domain: homeDomain,
                orderid: data.orderId,
                notification_url: resultUrl,
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject('[actGetSections response] Error');
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    });
},
};
export default {
    state, getters, mutations, actions,
};
