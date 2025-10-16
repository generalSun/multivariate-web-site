<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElPopover } from 'element-plus'
defineOptions({
  name: 'uiPopover',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-popover']
  if (typeof cssModule === 'string') {
    classList.push(cssModule)
  } else if (Array.isArray(cssModule)) {
    classList.push(...cssModule)
  }
  return classList.join(' ')
})
const uiRef = useTemplateRef('uiRef')
defineExpose({
  getUIRef() {
    return uiRef.value
  },
})
</script>
<template>
  <ElPopover ref="uiRef" :popper-class="classes">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElPopover>
</template>
<style lang="scss" scoped></style>
