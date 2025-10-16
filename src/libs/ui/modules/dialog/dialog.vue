<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElDialog } from 'element-plus'
defineOptions({
  name: 'uiDialog',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-dialog']
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
  <ElDialog ref="uiRef" :class="classes">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElDialog>
</template>
<style lang="scss" scoped>
:global(.ui-dialog.primary) {
  --el-color-info: black;
  --el-dialog-bg-color: var(--el-color-primary);
}
:global(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: gray;
}
:global(.el-dialog__header) {
  position: relative;
}
:global(.el-dialog__headerbtn) {
  width: 16px;
  height: 16px;
}
</style>
