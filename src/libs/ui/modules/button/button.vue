<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElButton } from 'element-plus'
defineOptions({
  name: 'uiButton',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-button']
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
  <ElButton ref="uiRef" :class="classes">
    <template v-if="!$slots.default && label" v-slot:default>
      {{ label }}
    </template>
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElButton>
</template>
<style lang="scss" scoped></style>
