console.log("syndication js");

import Vue from 'vue'

export const syndication = {
    actSyndicationLogin : (header) => {
        var syndicationURL = header.syndication;

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
            }).then((response) => {
                    if (response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actPaytmLogin]');
                    }
                }, (error) => {
                    reject(error.body);
                }
            )}
        )},
        actSyndicationSignup : (header) => {
            var syndicationURL = header.syndication;
     
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
                }).then((response) => {
                        if (response.status == 201) {
                            resolve(response.body);
                        } else {
                            resolve(response.body);
                        }
                    }, (error) => {
                        reject(error.body);
                    }
                )}
            )},
            actCreateOrderForPromotion: (orderDetails) => {
                
            },
            actSendWelcomeEmailCampaign: (payload) => {
                let homeDomain = undefined;
                if (localStorage.getItem('homeDomain')) {
                    homeDomain = localStorage.getItem('homeDomain');
                }
              let  proxyPayment = localStorage.getItem('paymentProxyURL') ?  localStorage.getItem('paymentProxyURL') : 'https://preprod-payment.cloud.altbalaji.com/';

              console.log("here")
                let url = proxyPayment + 'extensions/' + localStorage.getItem('partner_id') + '/send_mail'
              return new Promise((resolve, reject) => {
                Vue.http.post(url , payload).then((response) => {
                    console.log("response", response);
                    resolve(true);
                }, (error) =>{
                    reject(error.body)
                })
              });


            }
    };

