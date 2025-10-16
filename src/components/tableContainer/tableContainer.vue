<script setup>
import {
  computed,
  getCurrentInstance,
  ref,
  useTemplateRef,
  provide,
  watch,
  reactive,
  defineExpose,
  nextTick,
} from 'vue'
import tableColumn from './tableColumn.vue'
import { v4 as uuidV4 } from 'uuid'
import topButton from './topButton.vue'
import { isType } from '@/utils'
import ui from '@/libs/ui'
import { useCloned } from '@/utils/vueUse'
import { getFormItemProp } from './config.js'
const { sunForm, sunTable, sunPagination } = ui
const { gridAttributes, additionalAttributes, dataRequest, gridItemList, showPagination } = defineProps({
  gridAttributes: {
    type: [Object, Function],
    default: () => ({}),
  },
  gridItemList: {
    type: Array,
    default: () => [],
    required: true,
  },
  additionalAttributes: {
    type: Object,
    default: () => ({}),
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  dataRequest: {
    type: Function,
    default: () => () => {},
  },
  buttonsConfig: {
    type: [Object, Function],
  },
})
const currentInstance = getCurrentInstance()
const paginationAttributes = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total, sizes, prev, pager, next, jumper',
})
const radioModelValue = defineModel('radioModelValue')
const originalTableData = ref([])
const tableColumnRefs = ref({})
tableColumnRefs.value = {}
const formModel = ref({})
formModel.value = {}
const allItemList = ref([])
const visibleItemList = ref([])
const filterValue = ref({})
const sortValue = ref({})
const sunFormRef = useTemplateRef('sunFormRef')
const sunTableRef = useTemplateRef('sunTableRef')
formModel.value.tableData = computed(() => {
  const data = originalTableData.value ?? []
  if (!showPagination) {
    return data
  }
  if (data.length <= paginationAttributes.pageSize) {
    return data
  }
  return data.slice(
    (paginationAttributes.currentPage - 1) * paginationAttributes.pageSize,
    paginationAttributes.currentPage * paginationAttributes.pageSize
  )
})
const displayColumnList = computed(() => {
  const result = []
  gridItemList.forEach((item) => {
    if (item.type) {
      result.push(item)
    } else if (visibleItemList.value.find((v) => v?.prop === item.prop)) {
      result.push(item)
    }
  })
  return result
})
const formInstance = computed(() => {
  return sunFormRef.value?.getUIRef?.()
})
const tableInstance = computed(() => {
  return sunTableRef.value?.getUIRef?.()
})
const paramsValue = computed(() => {
  return {
    additionalAttributes: additionalAttributes,
    exposed: currentInstance.exposed,
    tableInstance: tableInstance.value,
    formInstance: formInstance.value,
    paginationAttributes: paginationAttributes,
    radioModelValue: radioModelValue.value,
    formModel: formModel.value,
    filterValue: filterValue.value,
  }
})
const gridAttributesComputed = computed(() => {
  if (isType(gridAttributes, 'Function')) {
    return { ...gridAttributes(paramsValue.value) }
  } else if (isType(gridAttributes, 'Object')) {
    return { ...gridAttributes }
  }
  return {}
})
const internalAttributes = ref({})
const internalGridAttributes = ref({})
const defaultGridAttributes = {
  border: true,
  rowKey: 'id',
}
watch(
  gridAttributesComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    const { setting, fullScreen, ...args } = newVal ?? {}
    internalGridAttributes.value = {
      ...defaultGridAttributes,
      ...args,
    }
    internalAttributes.value = {
      setting,
      fullScreen,
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => gridItemList,
  (newVal) => {
    const list = (newVal ?? [])
      .filter((item) => !!item.prop)
      .map((item, index) => {
        return {
          prop: item.prop,
          label: item.label,
          id: item.prop,
          order: index,
        }
      })
    const { cloned: all } = useCloned(list)
    const { cloned: visible } = useCloned(list)
    allItemList.value = all.value
    visibleItemList.value = visible.value
  },
  { immediate: true, deep: true }
)
const getData = async () => {
  try {
    const { pageSize, currentPage } = paginationAttributes
    const { data, total } = await dataRequest({
      pageSize,
      currentPage,
      filters: filterValue.value,
      sorts: sortValue.value,
    })
    if (!data?.length && currentPage > 1) {
      return onCurrentChange(currentPage - 1)
    }
    originalTableData.value = (data ?? []).map((item) => {
      const id = item.id ?? uuidV4()
      return { ...item, id }
    })
    paginationAttributes.total = total ?? originalTableData.value.length
  } catch {
    originalTableData.value = []
    paginationAttributes.total = 0
  } finally {
    await nextTick()
    scrollToRow(1)
    scrollToCol(1)
  }
}
const onPageSizeChange = (val) => {
  paginationAttributes.pageSize = val
  paginationAttributes.currentPage = 1
  return getData()
}
const onCurrentChange = (val) => {
  paginationAttributes.currentPage = val
  return getData()
}
// 滚动到指定行
const scrollToRow = (index) => {
  // 获取表格的滚动容器
  const innerWrapper = tableInstance.value?.$el?.querySelector('.el-table__inner-wrapper')
  const children = innerWrapper.children
  const scrollWrapper = Array.from(children).find((item) => item.classList.contains('el-table__body-wrapper'))
  if (!scrollWrapper) return
  // 获取所有行元素
  const rows = scrollWrapper.querySelectorAll('.el-table__row')
  if (!rows || !rows.length) return
  const rowIndex = Math.max(1, Math.min(index, rows.length))
  // 计算目标行的垂直位置
  const targetRow = rows[rowIndex - 1]
  const offsetTop = targetRow.offsetTop
  tableInstance.value?.setScrollTop(offsetTop)
}
// 滚动到指定列
const scrollToCol = (index) => {
  // 获取表格的滚动容器
  const innerWrapper = tableInstance.value?.$el?.querySelector('.el-table__inner-wrapper')
  const children = innerWrapper.children
  const scrollWrapper = Array.from(children).find((item) => item.classList.contains('el-table__header-wrapper'))
  if (!scrollWrapper) return
  // 获取所有列元素
  const cols = scrollWrapper.querySelectorAll('.el-table__cell')
  if (!cols || !cols.length) return
  const colIndex = Math.max(1, Math.min(index, cols.length))
  // 计算目标行的水平位置
  const targetCol = cols[colIndex - 1]
  const offsetLeft = targetCol.offsetLeft
  tableInstance.value?.setScrollLeft(offsetLeft)
}
const processValidateError = (e) => {
  const keys = Object.keys(e)
  const firstInfo = keys?.[0] ?? ''
  if (firstInfo) {
    const arr = firstInfo.split('.')
    const rowIndex = Number(arr?.[1] ?? 0)
    const colFiledName = arr?.[2] ?? ''
    const colIndex = displayColumnList.value?.findIndex((item) => item.prop === colFiledName) ?? 0
    scrollToRow(rowIndex + 1)
    scrollToCol(colIndex + 1)
  }
}
const validate = async () => {
  try {
    await formInstance.value?.validate()
    return JSON.parse(JSON.stringify(originalTableData.value))
  } catch (e) {
    processValidateError(e)
    return Promise.reject(e)
  }
}
const validateField = async (arr) => {
  try {
    await formInstance.value?.validateField(arr)
    return JSON.parse(JSON.stringify(originalTableData.value))
  } catch (e) {
    processValidateError(e)
    return Promise.reject(e)
  }
}
const validateRow = async (row) => {
  const item = tableColumnRefs.value.tableData[row] ?? {}
  const arr = Object.keys(item).map((key) => getFormItemProp(row, key))
  return validateField(arr)
}
const clearValidate = async (props) => {
  try {
    await formInstance.value?.clearValidate(props)
    return JSON.parse(JSON.stringify(originalTableData.value))
  } catch (e) {
    return Promise.reject(e)
  }
}
const onCurrentChangeHandler = (row) => {
  radioModelValue.value = JSON.stringify(row)
}
let expandRow
const onExpandChangeHandler = (row, expanded) => {
  const isExpanded = isType(expanded, 'Array') ? expanded.length : expanded
  if (isExpanded) {
    const index = originalTableData.value?.findIndex?.((item) => item.id === row.id)
    if (expandRow && expandRow !== row) {
      tableInstance.value.toggleRowExpansion(expandRow, false)
    }
    expandRow = row
    nextTick(() => {
      scrollToRow(index + 1)
      scrollToCol(1)
    })
  }
}
const onFilterChangeHandler = (val) => {
  filterValue.value ??= {}
  Object.keys(val).forEach((key) => {
    filterValue.value[key] = val[key]
  })
  return onCurrentChange(1)
}
const onSortChangeHandler = (val) => {
  sortValue.value = val
  return onCurrentChange(1)
}
const getSelections = () => {
  return tableInstance.value?.getSelectionRows() ?? []
}
const toggleRowSelection = (row, selected, ignoreSelectable) => {
  tableInstance.value?.toggleRowSelection(row, selected, ignoreSelectable)
}
const clearSelection = () => {
  tableInstance.value?.clearSelection()
}
const deleteRow = (row, rowKey = 'id') => {
  const data = originalTableData.value ?? []
  const index = data.findIndex((item) => item[rowKey] === row[rowKey])
  if (index >= 0) {
    paginationAttributes.total--
    const deleteData = data.splice(index, 1)
    toggleRowSelection(deleteData[0], false)
    return deleteData
  }
}
const addRow = (row = {}, index = 0) => {
  let i = index
  if (index < 0) {
    i = originalTableData.value.length + 1 + index
  }
  if (i < 0) {
    i = 0
  }
  paginationAttributes.total++
  const id = row.id ?? uuidV4()
  originalTableData.value.splice(i, 0, { ...row, id })
}
const getTableColumnRef = (name, key) => {
  if (!name && !key) {
    return tableColumnRefs.value
  }
  if (!key) {
    return tableColumnRefs.value[name]
  }
  return tableColumnRefs.value[name][key]
}
provide('tableContainerProvider', {
  getTableColumnRef,
})
defineExpose({
  onCurrentChange,
  onPageSizeChange,
  validate,
  validateField,
  validateRow,
  clearValidate,
  getSelections,
  toggleRowSelection,
  clearSelection,
  deleteRow,
  addRow,
  onFilterChangeHandler,
  getTableColumnRef,
  get tableData() {
    return originalTableData.value ?? []
  },
})
</script>

<template>
  <sunForm class="tableContainer" ref="sunFormRef" :model="formModel">
    <topButton
      v-model:visibleItemList="visibleItemList"
      :buttonsConfig="buttonsConfig"
      :paramsValue="paramsValue"
      :setting="internalAttributes.setting"
      :fullScreen="internalAttributes.fullScreen"
      :allItemList="allItemList"
    ></topButton>
    <sunTable
      ref="sunTableRef"
      :data="formModel.tableData"
      v-bind="internalGridAttributes"
      @current-change="onCurrentChangeHandler"
      @expand-change="onExpandChangeHandler"
      @filter-change="onFilterChangeHandler"
      @sort-change="onSortChangeHandler"
    >
      <template v-for="item of displayColumnList" :key="item.prop ?? item.type ?? item.label">
        <tableColumn
          v-model:radioModelValue="radioModelValue"
          :paramsValue="paramsValue"
          :itemInfo="item"
        ></tableColumn>
      </template>
      <template #append></template>
      <template #empty></template>
    </sunTable>
    <sunPagination
      v-if="showPagination && formModel.tableData.length"
      v-model:page-size="paginationAttributes.pageSize"
      v-model:current-page="paginationAttributes.currentPage"
      :total="paginationAttributes.total"
      :page-sizes="paginationAttributes.pageSizes"
      :layout="paginationAttributes.layout"
      @size-change="onPageSizeChange"
      @current-change="onCurrentChange"
    ></sunPagination>
  </sunForm>
</template>

<style scoped lang="scss">
.tableContainer {
  background-color: var(--el-bg-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  & > .topButton {
    margin-bottom: 10px;
  }
  & > .ui-table {
    flex: 1;
  }
  & > .ui-pagination {
    margin-top: 10px;
  }
}
</style>
