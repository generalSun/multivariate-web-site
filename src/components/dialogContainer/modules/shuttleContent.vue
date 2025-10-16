<script setup>
import { useTemplateRef, computed, defineExpose, watchEffect } from 'vue'
import { sunBack, sunRight } from '@/libs/ui/icon'
import shuttleTable from './shuttleContentBox/shuttleTable.vue'
defineOptions({
  name: 'shuttleContent',
})
defineProps({
  leftAdditionalAttributes: {
    type: Object,
    default: () => ({}),
  },
  rightAdditionalAttributes: {
    type: Object,
    default: () => ({}),
  },
  leftDataRequest: {
    type: Function,
    default: () => () => {},
  },
  rightDataRequest: {
    type: Function,
    default: () => () => {},
  },
  showPagination: {
    type: Boolean,
    default: true,
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
const leftTableRef = useTemplateRef('leftTableRef')
const rightTableRef = useTemplateRef('rightTableRef')
const rightTableData = computed(() => {
  return rightTableRef.value?.tableData
})
const leftTableData = computed(() => {
  return leftTableRef.value?.tableData
})
watchEffect(() => {
  leftTableData.value?.forEach((item) => {
    const row = rightTableData.value?.find((v) => v.id === item.id)
    item.isSelectable = !row
    if (row) {
      leftTableRef.value?.toggleRowSelection(item, true, true)
    }
  })
})
const onToRightClickHandler = () => {
  const leftSelections = leftTableRef.value?.getSelections() ?? []
  leftSelections.forEach((item) => {
    const isSelectable = item.isSelectable ?? true
    if (isSelectable) {
      item.isSelectable = false
      const { isSelectable, ...args } = item
      rightTableRef.value?.addRow(args, 0)
      setTimeout(() => {
        rightTableRef.value?.toggleRowSelection(args, isSelectable, true)
      })
    }
  })
}
const onToLeftClickHandler = () => {
  const rightSelections = rightTableRef.value?.getSelections() ?? []
  const len = rightSelections.length
  for (let i = len - 1; i >= 0; i--) {
    const item = rightSelections[i]
    const row = leftTableData.value.find((v) => v.id === item.id)
    if (row) {
      row.isSelectable = true
      leftTableRef.value?.toggleRowSelection(row, false, true)
    }
    rightTableRef.value?.deleteRow(item)
  }
  rightTableRef.value?.clearSelection()
}
defineExpose({
  getSelections() {
    return rightTableRef.value?.getSelections() ?? []
  },
  get rightTableData() {
    return rightTableData.value
  },
})
</script>
<template>
  <div class="shuttleContent">
    <shuttleTable
      ref="leftTableRef"
      class="leftTable"
      :additionalAttributes="leftAdditionalAttributes"
      :dataRequest="leftDataRequest"
      :showPagination="showPagination"
      :gridItemList="gridItemList"
      :gridAttributes="gridAttributes"
    ></shuttleTable>
    <div class="shuttle">
      <sunBack class="pointerHover" @click="onToLeftClickHandler"></sunBack>
      <sunRight class="pointerHover" @click="onToRightClickHandler"></sunRight>
    </div>
    <shuttleTable
      ref="rightTableRef"
      class="rightTable"
      title="Target"
      :additionalAttributes="rightAdditionalAttributes"
      :dataRequest="rightDataRequest"
      :showPagination="showPagination"
      :gridItemList="gridItemList"
      :gridAttributes="gridAttributes"
    ></shuttleTable>
  </div>
</template>
<style lang="scss" scoped>
.shuttleContent {
  height: 60vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 30px 1fr;
  column-gap: 5px;
  .shuttle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > :not(:last-child) {
      margin-bottom: 5px;
    }
    svg {
      width: 18px;
    }
  }
}
</style>
