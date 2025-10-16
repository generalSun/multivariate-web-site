<script setup>
import routerView from '@/libs/ui/routerView.vue'
defineOptions({
  name: 'mainComponent',
})
</script>
<template>
  <div class="mainComponent">
    <routerView :key="$route.fullPath"></routerView>
  </div>
</template>
<style lang="scss" scoped>
.mainComponent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
