<script setup>
import { useTemplateRef, onMounted, ref } from 'vue'
import { tableContainer } from '@/components/tableContainer'
import { describeConfig } from '../config/index.jsx'
import ui from '@/libs/ui'
defineOptions({
  name: 'describeTableContainer',
})
const { sunInput } = ui
const { tableData, describeDetail } = defineProps({
  describeDetail: {
    type: String,
    default: '',
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  parentInfo: {
    type: Object,
    default: () => ({}),
  },
})
const { gridAttributes, gridItemList } = describeConfig
const describeValue = ref(describeDetail)
const tableContainerRef = useTemplateRef('tableContainerRef')
const dataRequest = () => {
  return {
    data: tableData,
    total: tableData.length,
  }
}
const buttonsConfig = () => {}
onMounted(() => {
  tableContainerRef.value.onCurrentChange(1)
})
</script>
<template>
  <div class="describeTableContainer">
    <sunInput
      class="description"
      v-model="describeValue"
      resize="none"
      type="textarea"
      :readonly="true"
      :autosize="true"
    ></sunInput>
    <tableContainer
      ref="tableContainerRef"
      :additionalAttributes="{ parentInfo: parentInfo }"
      :gridAttributes="gridAttributes"
      :dataRequest="dataRequest"
      :gridItemList="gridItemList"
      :buttonsConfig="buttonsConfig"
    ></tableContainer>
  </div>
</template>
<style scoped lang="scss">
.describeTableContainer {
  padding: 10px;
  border: 1px solid var(--el-color-primary);
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .description {
    font-size: 14px;
    color: var(--el-color-primary);
    margin-bottom: 10px;
  }
  .tableContainer {
    flex: 1;
  }
}
</style>
