<script setup>
import { ref, useTemplateRef, watchEffect } from 'vue'
import { codeEditor } from '@/components/codeEditor'
import { formContainer } from '@/components/formContainer'
import ui from '@/libs/ui'
import { formAttributes, projectFormItemList, moduleFormItemList } from './importMappingDetailContentBox/config.js'
import { isType } from '@/utils'
defineOptions({
  name: 'importMappingDetailContent',
})
const { sunCollapse, sunCollapseItem } = ui
const { importData } = defineProps({
  importData: {
    type: [Object, Array],
    default: () => ({}),
  },
})
const projectFormRef = useTemplateRef('projectFormRef')
const moduleFormRef = useTemplateRef('moduleFormRef')
const activeNames = ref(['1'])
const responseResult = ref('')
const projectFields = ref([])
const projectInitFormValue = ref({})
projectInitFormValue.value = {}
const moduleFields = ref([])
const moduleInitFormValue = ref({})
moduleInitFormValue.value = {}
watchEffect(() => {
  responseResult.value = JSON.stringify(importData, null, 2)
  projectFields.value = []
  moduleFields.value = []
  if (isType(importData, 'Object')) {
    Object.keys(importData).forEach((key) => {
      const data = importData[key]
      if (!isType(data, 'Array')) {
        if (projectFormItemList.some((item) => item.prop === key)) {
          projectInitFormValue.value[key] = key
        }
        projectFields.value.push({
          label: key,
          value: key,
        })
      } else {
        const info = data[0]
        const keys = Object.keys(info)
        moduleFields.value = keys.map((k) => {
          return {
            label: k,
            value: k,
          }
        })
        keys.forEach((k) => {
          if (moduleFormItemList.some((item) => item.prop === k)) {
            moduleInitFormValue.value[k] = k
          }
        })
      }
    })
  } else {
    const data = importData[0]
    const keys = Object.keys(data)
    const list = keys.map((key) => {
      return {
        label: key,
        value: key,
      }
    })
    moduleFields.value = list
    projectFields.value = list
    keys.forEach((key) => {
      if (moduleFormItemList.some((item) => item.prop === key)) {
        moduleInitFormValue.value[key] = key
      }
      if (projectFormItemList.some((item) => item.prop === key)) {
        projectInitFormValue.value[key] = key
      }
    })
  }
})
const validate = async () => {
  let errName = '1'
  try {
    const project = await projectFormRef.value?.validate()
    errName = '2'
    const module = await moduleFormRef.value?.validate()
    errName = ''
    return { project, module }
  } catch (e) {
    activeNames.value = [errName]
    return Promise.reject(e)
  }
}
defineExpose({
  validate,
})
</script>

<template>
  <div class="importMappingDetailContent">
    <sunCollapse v-model="activeNames">
      <sunCollapseItem title="项目字段映射" name="1">
        <formContainer
          ref="projectFormRef"
          :additionalAttributes="{ optionList: projectFields }"
          :formAttributes="formAttributes"
          :formItemList="projectFormItemList"
          :showButtons="false"
          :initialFormValue="projectInitFormValue"
        ></formContainer>
      </sunCollapseItem>
      <sunCollapseItem title="模块字段映射" name="2">
        <formContainer
          ref="moduleFormRef"
          :additionalAttributes="{ optionList: moduleFields }"
          :formAttributes="formAttributes"
          :formItemList="moduleFormItemList"
          :showButtons="false"
          :initialFormValue="moduleInitFormValue"
        ></formContainer>
      </sunCollapseItem>
    </sunCollapse>
    <codeEditor v-model="responseResult" language="json" :readOnly="true"></codeEditor>
  </div>
</template>

<style scoped lang="scss">
.importMappingDetailContent {
  height: 70vh;
  display: flex;
  flex-direction: column;
}
</style>
