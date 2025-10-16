<script setup>
import { computed, ref } from 'vue'
import { ElButtonGroup } from 'element-plus'
defineOptions({
  name: 'uiButtonGroup',
})
const { cssModule } = defineProps({
  cssModule: {
    type: [String, Array],
    default: '',
  },
})
const classes = computed(() => {
  const classList = ['ui-button-group']
  if (typeof cssModule === 'string') {
    classList.push(cssModule)
  } else if (Array.isArray(cssModule)) {
    classList.push(...cssModule)
  }
  return classList
})
const uiRef = ref('null')
defineExpose({
  getUIRef() {
    return uiRef.value
  },
})
</script>
<template>
  <ElButtonGroup ref="uiRef" :class="classes">
    <template v-for="key of Object.keys($slots)" :key="key" v-slot:[key]="scoped">
      <slot v-if="key" :name="key" v-bind="scoped"></slot>
    </template>
  </ElButtonGroup>
</template>
<style lang="scss" scoped></style>
