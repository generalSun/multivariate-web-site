<script setup lang="ts">
import { computed, defineProps, markRaw } from 'vue'
import ui from '@/libs/ui'
defineOptions({
  name: 'operateButton',
})
const { sunButton } = ui
const { buttonInfo } = defineProps({
  buttonInfo: {
    type: Object,
    default: () => ({}),
  },
})
const info = computed(() => {
  const { component, isShow, isExist, ...attributes } = buttonInfo
  return {
    component: markRaw(component ?? sunButton),
    isShow: isShow ?? true,
    isExist: isExist ?? true,
    attributes: attributes,
  }
})
defineExpose({
  get isExist() {
    return info.value.isExist
  },
  get isShow() {
    return info.value.isShow
  },
})
</script>

<template>
  <component v-if="info.isExist" v-show="info.isShow" :is="info.component" v-bind="info.attributes"></component>
</template>

<style scoped lang="scss"></style>
