<script setup>
import { useTemplateRef, computed, getCurrentInstance, readonly } from 'vue'
import ui from '@/libs/ui'
import { isType } from '@/utils'
defineOptions({
  name: 'dialogContainer',
})
const { sunDialog, sunButton } = ui
const { cssModule, buttonsConfig, confirmInterceptor } = defineProps({
  dynamicComponent: {
    type: Object,
  },
  dynamicProps: {
    type: Object,
    default: () => ({}),
  },
  headerComponent: {
    type: Object,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  cssModule: {
    type: [String, Array],
    default: '',
  },
  buttonsConfig: {
    type: Function,
  },
  confirmInterceptor: {
    type: Function,
  },
})
const emits = defineEmits(['confirm'])
const currentInstance = getCurrentInstance()
const { proxy } = currentInstance
const dialogVisible = defineModel(false)
const dialogInstance = useTemplateRef('dialogRef')
const dynamicComponentInstance = useTemplateRef('dynamicComponentRef')
const paramsInfo = computed(() => {
  return {
    dialogInstance: dialogInstance.value,
    dynamicComponentInstance: dynamicComponentInstance.value,
    exposed: currentInstance.exposed,
  }
})
const defaultButtons = readonly({
  confirm: {
    show: true,
    label: '确认',
    type: 'primary',
    disabled: false,
    onClick: () => {
      const flag = confirmInterceptor?.(paramsInfo.value) ?? true
      if (isType(flag, 'Promise')) {
        flag.then((res) => {
          dialogVisible.value = false
          emits('confirm', { ...paramsInfo.value, paramsValue: res })
        })
      } else if (flag) {
        dialogVisible.value = false
        emits('confirm', { ...paramsInfo.value, paramsValue: flag })
      }
    },
  },
  cancel: {
    show: true,
    label: '取消',
    type: 'default',
    disabled: false,
    onClick: () => {
      dialogVisible.value = false
    },
  },
})
const buttonList = computed(() => {
  let result
  if (!buttonsConfig) {
    result = defaultButtons
  } else {
    result = buttonsConfig(paramsInfo.value, defaultButtons)
  }
  return result
})
const dialogOptions = computed(() => {
  return {
    modal: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    destroyOnClose: true,
    cssModule: cssModule,
    title: '',
    ...proxy.$attrs,
  }
})
defineExpose({
  getDialogInstance: () => {
    return dialogInstance.value?.getUIRef()
  },
  getDynamicComponentInstance: () => {
    return dynamicComponentInstance.value
  },
  setDialogVisible(visible) {
    dialogVisible.value = visible
  },
})
</script>

<template>
  <sunDialog ref="dialogRef" v-model="dialogVisible" v-bind="dialogOptions">
    <template #header>
      <div class="el-dialog__title">
        <component
          v-if="headerComponent"
          :is="headerComponent"
          v-bind="{ title: dialogOptions.title, dynamicComponentInstance: dynamicComponentInstance }"
        >
        </component>
        <span v-else> {{ dialogOptions.title }}</span>
      </div>
    </template>
    <component
      v-if="dynamicComponent"
      class="dialog-content"
      ref="dynamicComponentRef"
      :is="dynamicComponent"
      v-bind="dynamicProps"
    />
    <template v-if="showFooter" #footer>
      <div class="dialog-footer">
        <component
          v-for="({ show = true, component, ...args }, key) of buttonList"
          :is="component ?? sunButton"
          v-show="show"
          :key="key"
          v-bind="args"
        >
        </component>
      </div>
    </template>
  </sunDialog>
</template>

<style lang="scss" scoped>
.dialog-content {
  max-height: 60vh;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
