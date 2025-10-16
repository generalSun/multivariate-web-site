<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { useCommonStore } from '@/stores/commonStore.js'
import {
  buttonConfig,
  messageConfig,
  experimentalFeatures,
  emptyValues,
  valueOnClear,
  defaultSize,
  defaultZIndex,
} from '@/configs/config'
defineOptions({
  name: 'uiConfigProvider',
})
const commonStore = useCommonStore()
const uiRef = useTemplateRef('uiRef')
const languageInfo = commonStore?.languageInfo ?? {}
const defaultAttributes = computed(() => {
  return {
    locale: languageInfo?.locale,
    button: buttonConfig,
    size: defaultSize,
    zIndex: defaultZIndex,
    message: messageConfig,
    experimentalFeatures: experimentalFeatures,
    emptyValues: emptyValues,
    valueOnClear: valueOnClear,
  }
})
defineExpose({
  getUIRef() {
    return uiRef.value
  },
})
</script>
<template>
  <ElConfigProvider ref="uiRef" v-bind="defaultAttributes">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElConfigProvider>
</template>
<style lang="scss" scoped></style>
