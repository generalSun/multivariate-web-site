<script setup>
import { computed, useTemplateRef } from 'vue'
import { ElLink } from 'element-plus'
defineOptions({
  name: 'uiLink',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-link']
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
  <ElLink ref="uiRef" :class="classes">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElLink>
</template>
<style lang="scss" scoped></style>
