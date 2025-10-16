<script setup>
import ui from '@/libs/ui'
defineOptions({
  name: 'filterPopoverContent',
})
const { sunButton } = ui
const { component, componentAttributes, filterTableData, tableReactiveValue, popoverExposed } = defineProps({
  component: {
    type: Object,
  },
  componentAttributes: {
    type: Object,
  },
  tableReactiveValue: {
    type: Object,
  },
  filterTableData: {
    type: Function,
  },
  popoverExposed: {
    type: Object,
  },
})
const modelValue = defineModel({ default: '' })
const onConfirmClickHandler = () => {
  let values = modelValue.value
  if (!Array.isArray(values)) {
    values = [values]
  }
  filterTableData?.(values)
  popoverExposed.setVisible(false)
}
const onResetClickHandler = () => {
  modelValue.value = ''
  onConfirmClickHandler()
}
const onResetAllClickHandler = () => {
  const { paramsValue } = tableReactiveValue ?? {}
  const { exposed } = paramsValue ?? {}
  const { getTableColumnRef } = exposed ?? {}
  const columnRefs = getTableColumnRef?.('header')
  if (columnRefs) {
    Object.keys(columnRefs).forEach((key) => {
      const columnRef = columnRefs[key]
      const popoverContainerRef = columnRef?.getPopoverContainerRef()
      const dynamicComponentRef = popoverContainerRef?.getDynamicComponentRef()
      if (dynamicComponentRef) {
        dynamicComponentRef.onResetClickHandler()
      }
    })
  }
}
defineExpose({
  onResetClickHandler,
})
</script>

<template>
  <div class="filterPopoverContent">
    <div class="topContent">
      <component v-if="component" v-model="modelValue" :is="component" v-bind="componentAttributes"></component>
    </div>
    <div class="bottomContent">
      <sunButton size="small" @click="onConfirmClickHandler">confirm</sunButton>
      <sunButton size="small" @click="onResetClickHandler">reset</sunButton>
      <sunButton size="small" @click="onResetAllClickHandler">resetAll</sunButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filterPopoverContent {
  padding: 20px;
  .bottomContent {
    margin-top: 20px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
}
</style>
