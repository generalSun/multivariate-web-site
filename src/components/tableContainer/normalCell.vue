<script setup>
import { computed, markRaw, ref, watch, useTemplateRef, inject, nextTick, getCurrentInstance, onMounted } from 'vue'
import { isType } from '@/utils'
import ui from '@/libs/ui'
import { getFormItemProp } from './config.js'
defineOptions({
  name: 'normalCell',
})
const { sunText, sunInput, sunFormItem } = ui
const { paramsValue, scoped, component, componentAttributes, editComponent, editComponentAttributes, customProps } =
  defineProps({
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
    editComponent: {
      type: [Object, Function],
    },
    editComponentAttributes: {
      type: [Object, Function],
    },
    customProps: {
      type: Object,
    },
  })
const modelValue = defineModel()
const tableContainerProvider = inject('tableContainerProvider')
const editState = ref(false)
const currentInstance = getCurrentInstance()
const formItemRef = useTemplateRef('formItemRef')
const editComponentRef = useTemplateRef('editComponentRef')
const internalComponentRef = useTemplateRef('internalComponentRef')
const formItemInstance = computed(() => formItemRef.value?.getUIRef())
const reactiveValue = computed(() => {
  return {
    paramsValue,
    scoped,
    instance: internalComponentRef.value,
    editInstance: editComponentRef.value,
    exposed: currentInstance.exposed,
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
const editComponentComputed = computed(() => {
  if (isType(editComponent, 'Function')) {
    return { ...editComponent?.(reactiveValue.value) }
  } else if (isType(editComponent, 'Object')) {
    return { ...editComponent }
  }
  return { ...sunInput }
})
const internalEditComponent = ref({})
watch(
  editComponentComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    internalEditComponent.value = markRaw(newVal ?? {})
  },
  { immediate: true, deep: true }
)
const editComponentAttributesComputed = computed(() => {
  if (isType(editComponentAttributes, 'Function')) {
    return { ...editComponentAttributes?.(reactiveValue.value) }
  } else if (isType(editComponentAttributes, 'Object')) {
    return { ...editComponentAttributes }
  }
  return {}
})
const internalEditComponentAttributes = ref({})
watch(
  editComponentAttributesComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    internalEditComponentAttributes.value = newVal ?? {}
  },
  { immediate: true, deep: true }
)
const isCanEdit = computed(() => {
  const { edit } = customProps ?? {}
  if (isType(edit, 'Function')) {
    return edit?.(reactiveValue.value) ?? false
  } else if (isType(edit, 'Boolean')) {
    return edit
  }
  return false
})
const formItemRules = computed(() => {
  const { rules } = customProps ?? {}
  if (isType(rules, 'Function')) {
    return rules?.(reactiveValue.value) ?? []
  } else if (isType(rules, 'Array')) {
    return rules
  }
  return []
})
const fieldName = computed(() => {
  return scoped?.column?.property ?? ''
})
const index = computed(() => {
  return scoped?.$index ?? 0
})
const formItemProp = computed(() => {
  return getFormItemProp?.(index.value, fieldName.value)
})
const validate = () => {
  return formItemInstance.value?.validate?.('blue')
}
const onCellItemClick = () => {
  editState.value = true
  nextTick(() => {
    const editInstance = editComponentRef.value?.getUIRef?.() ?? editComponentRef.value
    editInstance?.focus()
  })
}
onMounted(() => {
  watch(
    () => formItemProp.value,
    () => {
      if (fieldName.value && index.value >= 0) {
        const { getTableColumnRef } = tableContainerProvider
        const tableColumnRef = getTableColumnRef()
        tableColumnRef.tableData ??= []
        tableColumnRef.tableData[index.value] ??= {}
        tableColumnRef.tableData[index.value][fieldName.value] = currentInstance.exposed
      }
    },
    { immediate: true }
  )
})
defineExpose({
  validate,
})
</script>

<template>
  <sunFormItem
    ref="formItemRef"
    v-if="fieldName"
    class="normalCell"
    :prop="formItemProp"
    :rules="formItemRules"
    @click="onCellItemClick"
  >
    <template v-if="Object.keys(internalEditComponent).length && editState && isCanEdit">
      <component
        ref="editComponentRef"
        v-model="modelValue"
        :is="internalEditComponent"
        v-bind="internalEditComponentAttributes"
        @blur="editState = false"
      ></component>
    </template>
    <template v-else-if="Object.keys(internalComponent).length">
      <component
        ref="internalComponentRef"
        v-model="modelValue"
        :is="internalComponent"
        v-bind="internalComponentAttributes"
      ></component>
    </template>
    <template v-else>
      <sunText truncated title=" ">{{ modelValue }}</sunText>
    </template>
  </sunFormItem>
</template>

<style scoped lang="scss">
.normalCell {
  width: 100%;
  min-height: 32px;
  &:not(.is-error) {
    margin-bottom: unset;
  }
}
</style>
