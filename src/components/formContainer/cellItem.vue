<script setup>
import ui from '@/libs/ui'
import { computed, markRaw, ref, watch, useTemplateRef } from 'vue'
import { isType } from '@/utils'
defineOptions({
  name: 'cellItem',
})
const { sunInput, sunText } = ui
const { itemInfo, paramsValue } = defineProps({
  itemInfo: {
    type: Object,
    default: () => ({}),
  },
  paramsValue: {
    type: Object,
    default: () => ({}),
  },
})
const modelValue = defineModel()
const internalComponentRef = useTemplateRef('internalComponentRef')
const reactiveValue = computed(() => {
  return {
    paramsValue,
    itemInfo,
    instance: internalComponentRef.value,
  }
})
const attributes = computed(() => {
  const { componentProps, component, isText, ...args } = itemInfo
  return { componentProps, component, isText, args }
})
const componentComputed = computed(() => {
  const { component, isText } = attributes.value
  if (isText) {
    return {}
  }
  if (isType(component, 'Function')) {
    return { ...(component(reactiveValue.value) ?? sunInput) }
  } else if (isType(component, 'Object')) {
    return { ...(component ?? sunInput) }
  }
  return { ...sunInput }
})
const internalComponent = ref({})
watch(
  componentComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    internalComponent.value = markRaw(newVal ?? {})
  },
  { immediate: true, deep: true }
)
const componentPropsComputed = computed(() => {
  const { componentProps, args } = attributes.value
  if (isType(componentProps, 'Function')) {
    return Object.assign({}, componentProps(reactiveValue.value) ?? {}, args)
  } else if (isType(componentProps, 'Object')) {
    return Object.assign({}, componentProps ?? {}, args)
  }
  return args
})
const internalComponentProps = ref({})
watch(
  componentPropsComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    internalComponentProps.value = newVal ?? {}
  },
  { immediate: true, deep: true }
)
</script>
<template>
  <div class="cellItem">
    <template v-if="Object.keys(internalComponent).length">
      <component
        class="cellContent"
        ref="internalComponentRef"
        :is="internalComponent"
        v-model="modelValue"
        v-bind="internalComponentProps"
      ></component>
    </template>
    <sunText class="cellContent" truncated v-else>{{ modelValue }}</sunText>
  </div>
</template>
<style scoped lang="scss">
.cellItem {
  width: 100%;
  height: 100%;
  & > :deep(.cellContent) {
    width: 100%;
  }
}
</style>
