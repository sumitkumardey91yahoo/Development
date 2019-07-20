<template>
  <div class="ch-state-slct alt-popup-bg dark-bg" id="ch-state-slct">
    <div class="popup-box">
      <div class="popup-bg state-popup">
        <div class="form-group">
          <h4>Please select your state to comply with GST(Mandatory requirement for uninterupted service)</h4>
        </div>
        <div class="form-group">
          <select class="slct-control" v-model="selectedState">
            <option v-for="state in statesObj" :value="state">{{state}}</option>
          </select>
        </div>
        <button type="button" class="btn grad-btn btn-lg" @click="updateState">UPDATE</button>
      </div>
      <p v-show="ErrorStateMessage" id="errorMessage">{{ErrorStateMessage}}</p>
    </div>
  </div>
</template>
<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins';

export default {
  data() {
    return {
      statesObj: {
        "SC":"Select State","AP":"Andhra Pradesh", "AR":"Arunachal Pradesh", "AS":"Assam", "BR":"Bihar", "CG":"Chhattisgarh", "Chandigarh":"Chandigarh", "DN":"Dadra and Nagar Haveli", "DD":"Daman and Diu", "DL":"Delhi", "GA":"Goa", "GJ":"Gujarat", "HR":"Haryana", "HP":"Himachal Pradesh", "JK":"Jammu and Kashmir", "JH":"Jharkhand", "KA":"Karnataka", "KL":"Kerala", "MP":"Madhya Pradesh", "MH":"Maharashtra", "MN":"Manipur", "ML":"Meghalaya", "MZ":"Mizoram", "NL":"Nagaland", "OR":"Orissa", "PB":"Punjab", "PY":"Pondicherry", "RJ":"Rajasthan", "SK":"Sikkim", "TN":"Tamil Nadu", "TR":"Tripura", "UP":"Uttar Pradesh", "UK":"Uttarakhand", "WB":"West Bengal",
      },
      selectedState: 'Select State',
      ErrorStateMessage : undefined,
    };
  },
  computed: {
    ...mapGetters([
      'routerFromParam',
    ]),
  },
  methods: {
    ...mapActions([
      'actGetUpdateUser',
      'actCheckWithAccount',
      'actGetProfileSwitch'
    ]),
    updateState() {
      if (this.selectedState != "Select State") {
        this.toggleLoader(true);

        this.ErrorStateMessage = undefined;

        let altAccount = undefined;
        altAccount = localStorage.getItem("altAccount") ? JSON.parse(localStorage.getItem("altAccount")) : undefined;
        if (altAccount && altAccount.details && !altAccount.details.state){
            altAccount.details = {'state':this.selectedState};
            localStorage.setItem("altAccount",JSON.stringify(altAccount));
        }

        this.actGetUpdateUser({
          details: {
            country: 'India',
            state: this.selectedState
          }
        }).then((response) => {
          if (response.status && response.status == 'ok') {

            this.toggleLoader(false);

            var paytmRedirectDecision = undefined;
      paytmRedirectDecision = localStorage.getItem("campaign-redirect") ? localStorage.getItem("campaign-redirect") : undefined;

      let promotionalFlag = localStorage.getItem("promotional-redirect") ? localStorage.getItem("promotional-redirect") : undefined;

      if (paytmRedirectDecision || promotionalFlag) {
            this.toggleLoader(true);
            if (paytmRedirectDecision) {
                localStorage.removeItem("campaign-redirect");
                if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                  window.location.replace(location.protocol + '//' + location.host );
                } else {
                    this.$router.push({ name: 'paymentPage' });
                }
            } else if (promotionalFlag) {
                let  routerObj = {
                      name: 'promotionalWoohooPage',
                      query: {
                      partner: this.$route.query.partner
                      }
                  };
                this.$router.push(routerObj);         
            }

      } else {
              if(this.routerFromParam) {
                if (this.routerFromParam.name == 'kids') {
                  var altOrder = undefined;
                  if (localStorage.getItem('altOrder')) {
                    altOrder = JSON.parse(localStorage.getItem('altOrder'));
                  }
                  if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                    this.checkUserAccount();
                  } else {
                    this.$router.push({ name: 'subscribe' });
                  }
                }  else if (this.routerFromParam.name == 'media' || this.routerFromParam.name == 'show' || this.routerFromParam.name == 'episode'){
                  this.$router.push(this.routerFromParam.fullPath);
                } else if(this.routerFromParam.name == 'rent') {
                  this.$router.push(this.routerFromParam.fullPath);
                } else {
                  this.$router.push({ name: 'home' });
                }
              } else {
                  // console.log("this.routerFromParam | home ",this.routerFromParam);
                  this.$router.push({ name: 'home' });
              }

          }
            // Redirect to HomePage
            // Hide the Popup
            eventBus.$emit('togglePopupStateSelectEvent', false);
          }
        }, (error) => {
           // console.log('[PopupStateSelect -> actGetUpdateUser -> response ]', response);
        });

      } else {
        if (document.getElementById('errorMessage')) {
          document.getElementById('errorMessage').style.display='block';
        }

        this.ErrorStateMessage = "Please select your state to comply with GST(Mandatory requirement for uninterrupted service)";

        setTimeout(function () {document.getElementById('errorMessage').style.display='none'}, 3000);
      }
    },
    // NOTE added by sumit

    checkUserAccount() {
      this.actCheckWithAccount().then((response) => {
        // console.log('[HeaderMenu | checkUserAccount | response | response | ]', response);

        if (response.count && response.count > 1) {
          // Get the kids profile from the response
          var kidsProfile = response.profiles[1];

          // Check for pin
          if (response.account && response.account.pin) {
            kidsProfile.pin = response.account.pin;

            this.switchToKidsProfile(kidsProfile);
          } else {
            eventBus.$emit('togglePopupKidsCreatePin', true);
            this.toggleLoader(false);
          }
        } else {
          // console.log('[HeaderMenu | checkUserAccount | else | ]');

          eventBus.$emit('togglePopupKidsCreatePin', true);
          this.toggleLoader(false);
        }
      }, (error) => {
        // console.log('[HeaderMenu | checkUserAccount | error | ]', error);
      });
    },
    switchToKidsProfile(kidsProfile) {
      this.actGetProfileSwitch(kidsProfile).then((response) => {
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (altUser) {
          altUser.sessionToken = response.session_token;
          altUser.uuid = response.uuid;
          altUser.username = response.username;

          localStorage.setItem('altUser', JSON.stringify(altUser));
        }

        eventBus.$emit('toggleAppModeChangeEvent', 'kids');
        this.$router.push({ name: 'home' });
      }).catch((error) => {
        // console.log('[HeaderMenu | switchToKidsProfile | error | ]', error);
      });
    },
     // NOTE end by sumit
  },
  mixins: [ altMixins ]
}
</script>
