<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElPagination } from 'element-plus'
defineOptions({
  name: 'uiPagination',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-pagination']
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
  <ElPagination ref="uiRef" :class="classes">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElPagination>
</template>
<style lang="scss" scoped>
.ui-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  :deep(.el-pagination__sizes) {
    flex: 1;
  }
}
</style>
