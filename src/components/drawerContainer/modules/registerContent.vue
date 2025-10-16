<script setup>
import { formContainer } from '@/components/formContainer'
import { formAttributes, formItemList } from './registerContentBox/config.js'
import { useTemplateRef } from 'vue'
defineOptions({
  name: 'registerContent',
})
const registerFormRef = useTemplateRef('registerFormRef')
defineExpose({
  get registerFormRef() {
    return registerFormRef.value
  },
})
</script>

<template>
  <div class="registerContent">
    <formContainer
      ref="registerFormRef"
      :formAttributes="formAttributes"
      :formItemList="formItemList"
      :initialFormValue="{ gender: 'male' }"
      :showButtons="false"
    ></formContainer>
  </div>
</template>

<style scoped lang="scss">
.registerContent {
  height: 100%;
}
</style>
