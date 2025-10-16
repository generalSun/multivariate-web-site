<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import cellItem from './cellItem.vue'
import { itemFieldList, additionalCustomFieldList } from './config.js'
import { isType } from '@/utils'
import ui from '@/libs/ui'
defineOptions({
  name: 'formItemMiddleware',
})
const { sunFormItem } = ui
const { formItem, paramsValue } = defineProps({
  formItem: {
    type: Object,
    default: () => ({}),
  },
  paramsValue: {
    type: Object,
    default: () => ({}),
  },
})
const modelValue = defineModel()
const formItemRef = useTemplateRef('formItemRef')
const attributesClassification = computed(() => {
  const itemProps = {}
  const customProps = {}
  for (const key in formItem) {
    if ((itemFieldList ?? []).includes(key)) {
      itemProps[key] = formItem[key]
    } else if (!(additionalCustomFieldList ?? []).includes(key)) {
      customProps[key] = formItem[key]
    }
  }
  return { itemProps, customProps }
})
const formItemAttributesComputed = computed(() => {
  const result = {}
  const { itemProps } = attributesClassification.value
  const { formItemAttributes } = formItem
  if (isType(formItemAttributes, 'Function')) {
    Object.assign(result, formItemAttributes(paramsValue) ?? {}, itemProps)
  } else if (isType(formItemAttributes, 'Object')) {
    Object.assign(result, formItemAttributes ?? {}, itemProps)
  } else {
    Object.assign(result, itemProps)
  }
  return result
})
const internalFormItemAttributes = ref({})
const formItemLayout = ref({})
watch(
  formItemAttributesComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    const { layout, ...args } = newVal ?? {}
    internalFormItemAttributes.value = args
    formItemLayout.value = layout ?? {}
  },
  { immediate: true, deep: true }
)
</script>
<template>
  <sunFormItem
    ref="formItemRef"
    :class="{ hasStart: formItemLayout.start }"
    :style="{ '--span': formItemLayout.span ?? 1, '--start': formItemLayout.start ?? 1 }"
    v-bind="internalFormItemAttributes"
  >
    <cellItem
      v-model="modelValue"
      :itemInfo="attributesClassification.customProps"
      :paramsValue="paramsValue"
    ></cellItem>
  </sunFormItem>
</template>
<style scoped lang="scss">
.ui-form-item {
  grid-column: span var(--span);
  width: 100%;
  &.hasStart {
    grid-column: var(--start) / span var(--span);
  }
}
</style>
