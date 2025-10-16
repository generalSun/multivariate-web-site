<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElTooltip } from 'element-plus'
defineOptions({
  name: 'uiTooltip',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-tooltip']
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
  <ElTooltip ref="uiRef" :class="classes" popper-class="uiPopper">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElTooltip>
</template>
<style lang="scss" scoped>
:global(.uiPopper).el-popper {
  max-width: 300px;
}
</style>
