<template>
  <div class="alt-help">
    <router-view></router-view>

  </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';


export default {
  methods: {
    setSubscribePageHeader() {
      this.setHeaderTitle('subscribe');
      this.toggleSearchIco(false);
      this.toggleDeleteIco(false);
      this.toggleCloseIco(false);
    },
  },
  
  mounted() {
      console.log("main")
     this.setSubscribePageHeader();
  },
  mixins: [altMixins]
}
</script>
