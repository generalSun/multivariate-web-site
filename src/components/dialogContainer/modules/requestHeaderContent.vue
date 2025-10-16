<script setup>
import { tableContainer } from '@/components/tableContainer/index.js'
import { headerConfig } from './apiDetailContentBox/config.js'
import { useTemplateRef } from 'vue'
const tableContainerRef = useTemplateRef('tableContainerRef')
const dataRequest = () => {
  const list = tableContainerRef.value?.tableData
  return {
    data: list,
    total: list.length,
  }
}
const buttonsConfig = ({ exposed }) => {
  const { addRow, getSelections, deleteRow } = exposed ?? {}
  const selections = getSelections?.()
  return {
    add: {
      label: '添加',
      type: 'primary',
      onClick: () => {
        addRow?.({})
      },
    },
    delete: {
      label: '删除',
      type: 'danger',
      disabled: !selections?.length,
      onClick: () => {
        const list = getSelections?.()
        for (let i = list.length - 1; i >= 0; i--) {
          const row = list[i]
          deleteRow?.(row)
        }
      },
    },
  }
}
defineExpose({
  get tableContainerRef() {
    return tableContainerRef.value
  },
})
</script>

<template>
  <div class="requestHeaderContent">
    <tableContainer
      ref="tableContainerRef"
      :gridAttributes="headerConfig.gridAttributes"
      :dataRequest="dataRequest"
      :gridItemList="headerConfig.gridItemList"
      :buttonsConfig="buttonsConfig"
      :showPagination="false"
    ></tableContainer>
  </div>
</template>

<style scoped lang="scss">
.requestHeaderContent {
  height: 60vh;
  .tableContainer {
    height: 100%;
  }
}
</style>
