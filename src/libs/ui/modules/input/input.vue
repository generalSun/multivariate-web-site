<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElInput } from 'element-plus'
defineOptions({
  name: 'uiInput',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-input']
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
  <ElInput ref="uiRef" :class="classes">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElInput>
</template>
<style lang="scss" scoped>
.el-textarea :deep(.el-textarea__inner) {
  max-height: 150px;
  overflow-y: auto;
}
</style>
