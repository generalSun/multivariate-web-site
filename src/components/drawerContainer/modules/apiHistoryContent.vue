<script setup>
import { formContainer } from '@/components/formContainer'
import { formAttributes, formItemList } from './apiHistoryContentBox/config.js'
import { ref, useTemplateRef } from 'vue'
import ui from '@/libs/ui'
defineOptions({
  name: 'apiHistoryContent',
})
const { sunCollapse, sunCollapseItem } = ui
defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
})
const historyFormRef = useTemplateRef('historyFormRef')
const activeNames = ref('')
const historyList = ref([])
const buttonsConfig = ({}, { confirm, reset }) => {
  return { confirm, reset }
}
</script>

<template>
  <div class="apiHistoryContent">
    <formContainer
      ref="historyFormRef"
      :formAttributes="formAttributes"
      :formItemList="formItemList"
      :buttonsConfig="buttonsConfig"
      :showButtons="true"
    ></formContainer>
    <sunCollapse v-if="historyList.length" v-model="activeNames">
      <sunCollapseItem v-for="item of historyList" :key="item" :title="item.title" :name="item.name"></sunCollapseItem>
    </sunCollapse>
  </div>
</template>

<style scoped lang="scss">
.apiHistoryContent {
  height: 100%;
}
</style>
