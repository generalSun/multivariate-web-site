<script setup>
import { computed, markRaw, ref, watch, useTemplateRef } from 'vue'
import { isType } from '@/utils'
defineOptions({
  name: 'expandCell',
})
const { paramsValue, scoped, component, componentAttributes, customProps } = defineProps({
  paramsValue: {
    type: Object,
    default: () => ({}),
  },
  scoped: {
    type: Object,
  },
  component: {
    type: [Object, Function],
  },
  componentAttributes: {
    type: [Object, Function],
  },
  customProps: {
    type: Object,
  },
})
const internalComponentRef = useTemplateRef('internalComponentRef')
const reactiveValue = computed(() => {
  return {
    paramsValue,
    scoped,
    instance: internalComponentRef.value,
  }
})
const componentComputed = computed(() => {
  if (isType(component, 'Function')) {
    return { ...component?.(reactiveValue.value) }
  } else if (isType(component, 'Object')) {
    return { ...component }
  }
  return {}
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
const componentAttributesComputed = computed(() => {
  if (isType(componentAttributes, 'Function')) {
    return { ...componentAttributes?.(reactiveValue.value) }
  } else if (isType(componentAttributes, 'Object')) {
    return { ...componentAttributes }
  }
  return {}
})
const internalComponentAttributes = ref({})
watch(
  componentAttributesComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    internalComponentAttributes.value = Object.assign({}, newVal ?? {}, customProps.attributes ?? {})
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="expandCell">
    <template v-if="Object.keys(internalComponent).length">
      <component ref="internalComponentRef" :is="internalComponent" v-bind="internalComponentAttributes"></component>
    </template>
  </div>
</template>

<style scoped lang="scss">
.expandCell {
  width: 100%;
  min-height: 32px;
  padding: 5px;
}
</style>
