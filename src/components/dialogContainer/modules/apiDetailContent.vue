<script setup>
import { ref, useTemplateRef, defineExpose, computed } from 'vue'
import { formContainer } from '@/components/formContainer'
import { detailConfig, domainConfig } from './apiDetailContentBox/config.js'
import ui from '@/libs/ui'
import RequestHeaderContent from './requestHeaderContent.vue'
import { codeEditor } from '@/components/codeEditor'
defineOptions({
  name: 'apiDetailContent',
})
const { sunCollapse, sunCollapseItem, sunButton } = ui
const { info } = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
  domainValue: {
    type: String,
    default: '',
  },
  parentPath: {
    type: String,
    default: '',
  },
})
const requestHeaderRef = useTemplateRef('requestHeaderRef')
const detailFormRef = useTemplateRef('detailFormRef')
const domainFormRef = useTemplateRef('domainFormRef')
const activeNames = ref(['1', '2'])
const responseResult = ref('')
const isCompleteApi = computed(() => {
  return !!detailFormRef.value?.formValue?.method
})
defineExpose({
  get requestHeaderRef() {
    return requestHeaderRef.value
  },
  get detailFormRef() {
    return detailFormRef.value
  },
  get domainFormRef() {
    return domainFormRef.value
  },
  get isCompleteApi() {
    return isCompleteApi.value
  },
  setResponseResult(result) {
    responseResult.value = result
  },
})
</script>
<template>
  <div class="apiDetailContent">
    <sunCollapse v-model="activeNames">
      <sunCollapseItem title="接口详情" name="1">
        <formContainer
          ref="detailFormRef"
          :formAttributes="detailConfig.formAttributes"
          :formItemList="detailConfig.formItemList"
          :initialFormValue="{ ...info, path: `${parentPath}${info.path}` }"
          :showButtons="false"
        ></formContainer>
      </sunCollapseItem>
      <sunCollapseItem title="域名设置" name="2">
        <formContainer
          ref="domainFormRef"
          :additionalAttributes="{ domainDisabled: !isCompleteApi }"
          :formAttributes="domainConfig.formAttributes"
          :formItemList="domainConfig.formItemList"
          :showButtons="false"
          :initialFormValue="{ domain: domainValue }"
        ></formContainer>
      </sunCollapseItem>
      <sunCollapseItem v-if="isCompleteApi" title="请求header" name="3">
        <RequestHeaderContent ref="requestHeaderRef"></RequestHeaderContent>
      </sunCollapseItem>
      <sunCollapseItem v-if="isCompleteApi" title="响应结果" name="4">
        <sunButton class="saveBtn" :disabled="!responseResult">保存</sunButton>
        <codeEditor v-model="responseResult" language="json"></codeEditor>
      </sunCollapseItem>
    </sunCollapse>
  </div>
</template>
<style scoped lang="scss">
.apiDetailContent {
  overflow: hidden;
  scrollbar-gutter: stable;
  &:hover {
    overflow: auto;
  }
  .saveBtn {
    margin-bottom: 5px;
  }
}
</style>
