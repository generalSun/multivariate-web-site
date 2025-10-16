<script setup>
import { useTemplateRef } from 'vue'
import { formContainer } from '@/components/formContainer'
import { formItemList, formAttributes } from './addProjectContentBox/config.js'
import { OPERATE_STATUS } from '@/configs/enums.js'
defineOptions({
  name: 'addProjectContent',
})
defineProps({
  initialFormValue: {
    type: Object,
    default: () => ({}),
  },
  status: {
    type: String,
    default: OPERATE_STATUS.create.value,
  },
})
const formContainerRef = useTemplateRef('formContainerRef')
defineExpose({
  get formContainerRef() {
    return formContainerRef.value
  },
})
</script>
<template>
  <formContainer
    ref="formContainerRef"
    class="addProjectContent"
    :additionalAttributes="{ status: status }"
    :formAttributes="formAttributes"
    :formItemList="formItemList"
    :initialFormValue="initialFormValue"
    :showButtons="false"
  ></formContainer>
</template>
<style scoped lang="scss"></style>
