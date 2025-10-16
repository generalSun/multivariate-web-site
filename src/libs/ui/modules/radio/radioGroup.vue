<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElRadioGroup } from 'element-plus'
import ui from '@/libs/ui'
defineOptions({
  name: 'uiRadioGroup',
})
const { sunRadio } = ui
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
  radioList: {
    type: Array,
    default: () => [],
  },
})
const classes = computed(() => {
  const classList = ['ui-radio-group']
  if (typeof cssModule === 'string') {
    classList.push(cssModule)
  } else if (Array.isArray(cssModule)) {
    classList.push(...cssModule)
  }
  return classList
})
const uiRef = useTemplateRef('uiRef')
defineExpose({
  getUIRef() {
    return uiRef.value
  },
})
</script>
<template>
  <ElRadioGroup ref="uiRef" :class="classes">
    <template v-if="!$slots.default && radioList?.length">
      <sunRadio v-for="item of radioList" :key="item.value" v-bind="item"></sunRadio>
    </template>
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElRadioGroup>
</template>
<style lang="scss" scoped></style>
