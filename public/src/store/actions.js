import Vue from 'vue'
/**
* Getting configuration
*/
export const actGetConfig = (context, payload) => {
    return new Promise( (resolve, reject) => {
        Vue.http.get(context.state.configUrl).then((response) => {
            // console.log('[Actions | actGetConfig | response | ]', response);

            if (response.ok && response.status == 200) {
                var resObj = response.body;
                resolve(resObj);
            } else {
                reject(response.statusText);
            }
        }, (error) => {
            // console.log(error);
            reject('[actGetConfig] Error');
        });
    });
}
/**
* Getting the domain
*/
export const actGetDomain = (context) => {
    // Get the config
    var altConfig = undefined;
    if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
    }

    // console.log('[actions | actGetDomain | altConfig | ]', altConfig);

    return new Promise( (resolve, reject) => {
        if (!altConfig) reject({ error: true, message: 'missing config data' });

        Vue.http.get(altConfig.geoApiUrl).then((response) => {
            // console.log('[actions | actGetDomain | response | ]', response);

            if (response.status == 200 && response.ok) {
                resolve(response.body);
            } else {
                reject({ error: true, message: 'Failed to get geo location data' });
            }
        }, (error) => {
            reject(error.body);
        });
    });
}
/**
 * User Login
 */
export const actGetUserSignup = (context, data) => {
    var baseUrl = context.getters.baseUrl;
    //NOTE 09.01.2018 added by sumit for row user
    var domain = localStorage.getItem('visitedDomain');

    return new Promise((resolve, reject) => {
        Vue.http.post(baseUrl + '/accounts?domain=' + domain, data).then((response) => {
            if (response.status == 201 && response.ok) {
                resolve(response.body)
            } else {
                reject({error: true, message: 'user signup response error'});
            }
        }, (error) => {
            reject(error.body);
        });
    });
}
/**
 * Update user
 */
export const actGetUpdateUser = (context, data) => {
    var baseUrl = context.getters.baseUrl;
    var domain = localStorage.getItem('homeDomain');
    var altUser = undefined;
    if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
    }

    return new Promise((resolve, reject) => {
        if (!(altUser) || !(altUser.sessionToken)) {
            reject({ error: true, message: 'user data not available' });
        }
        Vue.http.put(baseUrl + '/accounts?domain=' + domain, data, {
            headers: {
                XSSESSION: altUser.sessionToken
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body)
                } else {
                    reject({ code: response.status, message: 'user profile update error' });
                }
            },
            (error) => {
                reject(error.body);
            }
        );
    });
}
/**
 * User Login
 */
export const actGetUserLogin = (context, data) => {
    var baseUrl = context.getters.baseUrl;
    var domain = localStorage.getItem('homeDomain');

    // console.log('[actGetUserLogin | domain | ]', domain);

    return new Promise((resolve, reject) => {
        if (!(domain)) {
            reject({ error: true, message: 'missing domain data' });
        }
        Vue.http.post(baseUrl + '/accounts/login?domain=' + domain, {
            username: data.username,
            password: data.password
        }).then(
            (response) => {
                if (response.status == 200 && response.ok) {
                    resolve(response.body)
                } else {
                    reject({ error: true, message: 'user login response error' });
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    })
}

export const actGetAccountDetails = (context, user) => {
    var baseUrl = context.getters.baseUrl;
    var domain = localStorage.getItem('homeDomain');

    return new Promise((resolve, reject) => {
        if (user) {
            var sessionToken = user.sessionToken;
        } else {
            reject({ error: true, message: 'user object not available' })
        }

        Vue.http.get(baseUrl + '/accounts', {
            params: {
                domain: domain
            },
            headers: {
                XSSESSION: sessionToken
            }
        }).then(
            (response) => {
                if (response.status == 200) {
                    resolve(response.body);
                }
            },
            (error) => {
                reject({ error: true, error });
            }
        )
    })
}
/**
 * Gets the list of devices
 */
export const actGetDeviceList = (context, user) => {
    var baseUrl = context.getters.baseUrl;

    return new Promise((resolve, reject) => {
        if (user) {
            var sessionToken = user.sessionToken;
        } else {
            reject({ error: true, message: 'user object not available' })
        }

        Vue.http.get(baseUrl + '/accounts/devices', {
            headers: {
                XSSESSION: sessionToken,
            }
        }).then(
            (response) => {
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
}
/**
 * Register device
 */
export const actRegisterDevice = (context, registerObj) => {
    var baseUrl = context.getters.baseUrl;
    var user = registerObj.user;
    var deviceId = registerObj.deviceId;

    return new Promise((resolve, reject) => {
        if (user) {
            var sessionToken = user.sessionToken;
        } else {
            reject({ error: true, message: 'user object not available' })
        }
        if (!(deviceId)) {
            reject({ error: true, message: 'Device ID not available' })
        }

        var altDeviceName = localStorage.getItem('altDeviceName');

        Vue.http.post(baseUrl + '/accounts/devices', {
            uuid: deviceId,
            name: altDeviceName
        }, {
            headers: {
                XSSESSION: sessionToken
            }
        }).then(
            (response) => {
                if (response.ok && response.status != 404) {
                    resolve(response.body);
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    })
}
/**
* Deletes a device
*/
export const actDeleteDevice = (context, deleteObj) => {
    var baseUrl = context.getters.baseUrl;
    var user = deleteObj.user;
    var deviceId = deleteObj.deviceId;

    // console.log('[actions | actDeleteDevice | user | ]', user);
    // console.log('[actions | actDeleteDevice | deviceId | ]', deviceId);
    return new Promise((resolve, reject) => {
        if (user) {
            var sessionToken = user.sessionToken;
        } else {
            reject({ error: true, message: 'user object not available' })
        }
        if (!(deviceId)) {
            reject({ error: true, message: 'deviceId empty' })
        }

        Vue.http.delete(baseUrl + '/accounts/devices/' + deviceId, {
            headers: {
                XSSESSION: sessionToken
            }
        }).then(
            (response) => {
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
}
/**
 * get order list
 */
export const actGetOrders = (context, user) => {
    var baseUrl = context.getters.baseUrl;

    var domain = localStorage.getItem('homeDomain');

    let config = undefined;
    config = localStorage.getItem("altConfig")  ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
    baseUrl = config && config.environment && config.environment.mmURL? config.environment.mmURL : undefined;

    // console.log("baseUrl | action.js |",baseUrl);

    return new Promise((resolve, reject) => {
        if (user) {
            var sessionToken = user.sessionToken;
        } else {
            reject({ error: 'actGetOrders: user not available' })
        }
        //NOTE change by sumit,some time not taking baseUrl,so i added. 11/12/2017
        Vue.http.get(baseUrl+ 'accounts/orders', {
            params: {
                order_status: 'ok',
                domain: domain,
                sessionToken: sessionToken
            },
            headers: {
                XSSESSION: sessionToken
            }
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject(response.body);
                }
            },
            (error) => {
                // console.log(" action.js | error")
                reject(error.body);
            }
        )
    })
}
/**
 * get bts
 */
export const actGetBts = (context, tags) => {
    var baseUrl = context.getters.baseUrl;

    return new Promise((resolve, reject) => {
        Vue.http.get(baseUrl + '/media/videos', {
            params: {
                tags: tags
            },
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject(response.body);
                }
            },
            (error) => {
                // console.log(" action.js | error")
                reject(error.body);
            }
        )
    })
}
/**
 * get reviews
 */
export const actGetReviews = (context, tags) => {
    let config
    let appDataUrl

    config = localStorage.getItem("altConfig")  ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
    appDataUrl = config && config.environment && config.environment.app_data_url? config.environment.app_data_url : undefined;

    return new Promise((resolve, reject) => {
        Vue.http.get(appDataUrl, {
        }).then(
            (response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject(response.body);
                }
            },
            (error) => {
                reject(error.body);
            }
        )
    })
}
