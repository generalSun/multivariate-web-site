<script setup>
import { sunArrowLeft } from '@/libs/ui/icon.js'
defineOptions({
  name: 'customHeader',
})
const emits = defineEmits(['click'])
const onBackClickHandler = () => {
  emits('click')
}
</script>

<template>
  <div class="customHeader">
    <sunArrowLeft class="pointer" :style="{ height: '100%' }" @click="onBackClickHandler"></sunArrowLeft>
    <div class="title">自定义状态</div>
  </div>
</template>

<style scoped lang="scss">
.customHeader {
  height: 100%;
  display: flex;
  align-items: center;
  .title {
    flex: 1;
    text-align: center;
  }
}
</style>
