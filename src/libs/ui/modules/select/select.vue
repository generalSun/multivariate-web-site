<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElSelect } from 'element-plus'
import ui from '@/libs/ui'
defineOptions({
  name: 'uiSelect',
})
const { sunOption } = ui
const { cssModule, optionList } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
  optionList: {
    type: Array,
    default: () => [],
  },
})
const classes = computed(() => {
  const classList = ['ui-select']
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
  <ElSelect ref="uiRef" :class="classes">
    <template v-if="!$slots.default && optionList?.length">
      <sunOption v-for="option of optionList" :key="option.value" v-bind="option"></sunOption>
    </template>
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElSelect>
</template>
<style lang="scss" scoped></style>
