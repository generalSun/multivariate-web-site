<script setup>
import { onMounted, useTemplateRef, defineExpose, ref, computed } from 'vue'
import ui from '@/libs/ui'
import { tableContainer } from '@/components/tableContainer'
defineOptions({
  name: 'shuttleTable',
})
const { sunInput } = ui
defineProps({
  title: {
    type: String,
    default: 'Source',
  },
  dataRequest: {
    type: Function,
    default: () => () => {},
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  additionalAttributes: {
    type: Object,
    default: () => ({}),
  },
  gridItemList: {
    type: Array,
    default: () => [],
    required: true,
  },
  gridAttributes: {
    type: [Object, Function],
    default: () => ({}),
  },
})
const tableContainerRef = useTemplateRef('tableContainerRef')
const searchStr = ref('')
const tableData = computed(() => {
  return tableContainerRef.value?.tableData
})
const getSelections = () => {
  return tableContainerRef.value?.getSelections() ?? []
}
const toggleRowSelection = (row, selected, ignoreSelectable) => {
  tableContainerRef.value?.toggleRowSelection(row, selected, ignoreSelectable)
}
const clearSelection = () => {
  tableContainerRef.value?.clearSelection()
}
const deleteRow = (row, rowKey = 'id') => {
  return tableContainerRef.value?.deleteRow(row, rowKey)
}
const addRow = (row = {}, index = 0) => {
  return tableContainerRef.value?.addRow(row, index)
}
const onInputHandler = () => {
  const labelRef = tableContainerRef.value?.getTableColumnRef?.('header', 'label')
  if (labelRef) {
    labelRef.filterTableData([searchStr.value])
  }
}
onMounted(() => {
  tableContainerRef.value?.onCurrentChange(1)
})
defineExpose({
  getSelections,
  toggleRowSelection,
  clearSelection,
  deleteRow,
  addRow,
  get tableData() {
    return tableData.value
  },
})
</script>
<template>
  <div class="shuttleTable">
    <div class="topContent">
      <div class="titleBox">
        <span>{{ title }}</span>
        <span>{{ getSelections()?.length ?? 0 }}/{{ tableData?.length ?? 0 }}</span>
      </div>
      <sunInput class="searchInput" v-model="searchStr" placeholder="请输入字段名" @input="onInputHandler"></sunInput>
    </div>
    <tableContainer
      ref="tableContainerRef"
      class="bottomContent"
      :additionalAttributes="additionalAttributes"
      :dataRequest="dataRequest"
      :showPagination="showPagination"
      :gridItemList="gridItemList"
      :gridAttributes="gridAttributes"
    ></tableContainer>
  </div>
</template>
<style scoped lang="scss">
.shuttleTable {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 5px;
  .topContent {
    margin-bottom: 10px;
    .titleBox {
      padding: 10px 5px;
      background-color: var(--el-fill-color-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
  }
  .bottomContent {
    flex: 1;
  }
}
</style>
