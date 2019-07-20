<template>
  <div class="alt-loading">
    <div class="load-ico" :style="{ 'opacity': visibility ? '1' : '0' }">
      <img src="../../assets/loading.svg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'AltLoading',
  props: [
    'visibility'
  ]
}
</script>

<style lang="css" scoped>
.load-ico {
  text-align: center;
}
.load-ico img {
  width: 40px;
}
</style>
