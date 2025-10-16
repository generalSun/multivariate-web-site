<script setup>
import { useTemplateRef, computed, getCurrentInstance } from 'vue'
import ui from '@/libs/ui'
defineOptions({
  name: 'popoverContainer',
})
const { sunPopover } = ui
const { dynamicProps } = defineProps({
  dynamicComponent: {
    type: Object,
  },
  dynamicProps: {
    type: Object,
    default: () => ({}),
  },
})
const currentInstance = getCurrentInstance()
const popoverVisible = defineModel('visible')
const popoverRef = useTemplateRef('popoverRef')
const dynamicComponentRef = useTemplateRef('dynamicComponentRef')
const popoverInstance = computed(() => {
  return popoverRef.value?.getUIRef()
})
const popoverOptions = computed(() => {
  return {
    placement: 'bottom-start',
    'show-arrow': false,
    ...currentInstance.proxy.$attrs,
  }
})
const dynamicComponentAttributes = computed(() => {
  return {
    ...dynamicProps,
    popoverInstance: popoverInstance.value,
    popoverRef: popoverRef.value,
    popoverExposed: currentInstance.exposed,
  }
})
defineExpose({
  setVisible(visible) {
    popoverVisible.value = visible
  },
  getDynamicComponentRef() {
    return dynamicComponentRef.value
  },
})
</script>

<template>
  <sunPopover ref="popoverRef" v-model:visible="popoverVisible" v-bind="popoverOptions">
    <component
      v-if="dynamicComponent"
      ref="dynamicComponentRef"
      :is="dynamicComponent"
      v-bind="dynamicComponentAttributes"
    />
    <template #reference>
      <slot name="reference"></slot>
    </template>
  </sunPopover>
</template>

<style lang="scss" scoped></style>
