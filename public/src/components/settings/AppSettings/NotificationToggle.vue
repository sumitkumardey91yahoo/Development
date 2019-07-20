<template>
  <div class="tab-sec" @click.prevent="notificationToggleCB">
    <h4>Notifications</h4>
    <p>
      {{notificationState}}
      <span><img src="@/assets/right.svg"></span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'AppSettingsChngKidsPin',
  data () {
    return {
      notificationState: 'ON'
    }
  },
  created () {
    this.getNotificationState();
  },
  methods: {
    notificationToggleCB () {
      this.notificationState = (this.notificationState === 'OFF') ? 'ON' : 'OFF';
      // Set the value to local storage
      localStorage.setItem('notificationFlag', this.notificationState);
    },
    getNotificationState () {
      if (localStorage.getItem('notificationFlag')) {
        this.notificationState = localStorage.getItem('notificationFlag');
      }
    }
  }
}
</script>

<style lang="css">
</style>
