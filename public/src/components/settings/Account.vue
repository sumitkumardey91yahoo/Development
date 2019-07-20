<template>
  <div class="container">
    <div>
      <h6 class="setting-header profile">Profile</h6>
      <img class="edit-img" src="../../assets/close.svg" v-if="editProfileMode" @click="setEditProfileMode(false)">
      <img class="edit-img" src="../../assets/pencil.svg" v-else @click="setEditProfileMode(true)">
    </div>
    <div v-if="editProfileMode">
      <account-edit></account-edit>
    </div>
    <div v-else>
      <account-profile></account-profile>
      <account-logout></account-logout>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

const Logout = () => import (/* webpackChunkName: "settings-Account-Logout" */ './AccountLogout.vue');
const AccountProfile = () => import (/* webpackChunkName: "settings-Account-AccountProfile" */ './AccountProfile.vue');
const AccountEdit = () => import (/* webpackChunkName: "settings-Account-AccountEdit" */ './AccountEdit.vue');

export default {
  computed: {
    ...mapGetters([
      'editProfileMode',
    ])
  },
  methods: {
    ...mapMutations([
      'setEditProfileMode',
    ])
  },
  components: {
    'account-logout': Logout,
    'account-profile': AccountProfile,
    'account-edit': AccountEdit,
  }
}
</script>
