<script setup>
import { computed, getCurrentInstance, markRaw, onMounted, inject, ref, watch, defineExpose, useTemplateRef } from 'vue'
import { isType } from '@/utils'
import ui from '@/libs/ui'
import { SingleLineEllipsis } from '@/components/singleLineEllipsis'
import { sunInfoFilled, sunFilter, sunHide } from '@/libs/ui/icon'
import { popoverContainer, popoverContents } from '@/components/popoverContainer'
defineOptions({
  name: 'headerCell',
})
const { sunTooltip, sunInput } = ui
const { paramsValue, scoped, customProps, columnAttributes, filterComponent, filterComponentAttributes } = defineProps({
  paramsValue: {
    type: Object,
    default: () => ({}),
  },
  scoped: {
    type: Object,
  },
  columnAttributes: {
    type: Object,
  },
  customProps: {
    type: Object,
  },
  filterComponent: {
    type: [Object, Function],
  },
  filterComponentAttributes: {
    type: [Object, Function],
  },
})
const { filterPopoverContent } = popoverContents
const tableContainerProvider = inject('tableContainerProvider')
const popoverContainerRef = useTemplateRef('popoverContainerRef')
const currentInstance = getCurrentInstance()
const filterPopoverVisible = ref(false)
const reactiveValue = computed(() => {
  return {
    paramsValue,
    scoped,
    exposed: currentInstance.exposed,
  }
})
const headerTipComputed = computed(() => {
  const { headerTip } = customProps ?? {}
  if (isType(headerTip, 'Function')) {
    return headerTip(reactiveValue.value) ?? ''
  } else if (isType(headerTip, 'String')) {
    return headerTip ?? ''
  }
  return ''
})
const componentComputed = computed(() => {
  if (isType(filterComponent, 'Function')) {
    return { ...(filterComponent?.(reactiveValue.value) ?? sunInput) }
  } else if (isType(filterComponent, 'Object')) {
    return { ...(filterComponent ?? sunInput) }
  }
  return sunInput
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
  if (isType(filterComponentAttributes, 'Function')) {
    return { ...filterComponentAttributes?.(reactiveValue.value) }
  } else if (isType(filterComponentAttributes, 'Object')) {
    return { ...filterComponentAttributes }
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
    internalComponentAttributes.value = newVal ?? {}
  },
  { immediate: true, deep: true }
)
const filterTableData = (values) => {
  const { paramsValue, scoped } = reactiveValue.value
  const { tableInstance } = paramsValue ?? {}
  const { column } = scoped ?? {}
  const { store } = tableInstance ?? {}
  const { commit, updateAllSelected } = store ?? {}
  commit?.('filterChange', {
    column: column,
    values: values,
  })
  updateAllSelected?.()
}
onMounted(() => {
  const parentElement = currentInstance?.proxy?.$el?.parentElement
  if (parentElement) {
    parentElement.style.padding = '0'
    const tableCell = parentElement.closest('.el-table__cell')
    if (tableCell) {
      tableCell.style.padding = '0'
    }
    const sortElement = parentElement.querySelector('.caret-wrapper')
    const sortDom = currentInstance?.proxy?.$el.querySelector('.sort')
    if (sortElement) {
      sortElement.parentElement.removeChild(sortElement)
      sortDom?.appendChild(sortElement)
    }
    const filterElement = parentElement.querySelector('.el-table__column-filter-trigger')
    if (filterElement) {
      filterElement.parentElement.removeChild(filterElement)
    }
  }
  watch(
    () => scoped?.column?.property,
    (newVal) => {
      if (newVal) {
        const { getTableColumnRef } = tableContainerProvider
        const tableColumnRef = getTableColumnRef()
        tableColumnRef.header ??= {}
        tableColumnRef.header[newVal] = currentInstance.exposed
      }
    },
    { immediate: true }
  )
})
defineExpose({
  filterTableData,
  getPopoverContainerRef() {
    return popoverContainerRef.value
  },
})
</script>
<template>
  <div class="headerCell" @click.stop>
    <SingleLineEllipsis class="headerLabel" :text="columnAttributes.label"></SingleLineEllipsis>
    <sunTooltip v-if="headerTipComputed" :content="headerTipComputed" placement="top">
      <sunInfoFilled class="headerTip"></sunInfoFilled>
    </sunTooltip>
    <div v-if="columnAttributes.sortable" class="sort"></div>
    <popoverContainer
      v-if="customProps.filterable"
      ref="popoverContainerRef"
      v-model:visible="filterPopoverVisible"
      trigger="click"
      :dynamicComponent="filterPopoverContent"
      :dynamicProps="{
        component: internalComponent,
        componentAttributes: internalComponentAttributes,
        filterTableData: filterTableData,
        tableReactiveValue: reactiveValue,
        modelValue: customProps.filterValue,
      }"
    >
      <template #reference>
        <div class="filter">
          <sunHide v-if="filterPopoverVisible"></sunHide>
          <sunFilter v-else></sunFilter>
        </div>
      </template>
    </popoverContainer>
  </div>
</template>
<style scoped lang="scss">
.headerCell {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding: 12px 16px;
  & > .headerTip {
    margin-left: 5px;
  }
  & > .filter {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    width: 16px;
    overflow: hidden;
    min-width: 16px;
  }
}
</style>
