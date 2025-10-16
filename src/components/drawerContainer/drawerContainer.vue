<script setup>
import { useTemplateRef, computed, getCurrentInstance, readonly } from 'vue'
import ui from '@/libs/ui'
import { isType } from '@/utils'
import { defaultHeight } from '@/configs/config.js'
defineOptions({
  name: 'drawerContainer',
})
const { sunDrawer, sunButton } = ui
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
const drawerVisible = defineModel(false)
const drawerInstance = useTemplateRef('drawerRef')
const dynamicComponentInstance = useTemplateRef('dynamicComponentRef')
const paramsInfo = computed(() => {
  return {
    drawerInstance: drawerInstance.value,
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
          drawerVisible.value = false
          emits('confirm', { ...paramsInfo.value, paramsValue: res })
        })
      } else if (flag) {
        drawerVisible.value = false
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
      drawerVisible.value = false
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
const drawerOptions = computed(() => {
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
  getDrawerInstance: () => {
    return drawerInstance.value?.getUIRef()
  },
  getDynamicComponentInstance: () => {
    return dynamicComponentInstance.value
  },
  setDrawerVisible(visible) {
    drawerVisible.value = visible
  },
})
</script>

<template>
  <sunDrawer ref="drawerRef" v-model="drawerVisible" v-bind="drawerOptions">
    <template #header>
      <div class="el-drawer__title">
        <component
          v-if="headerComponent"
          :is="headerComponent"
          v-bind="{ title: drawerOptions.title, dynamicComponentInstance: dynamicComponentInstance }"
        >
        </component>
        <span v-else> {{ drawerOptions.title }}</span>
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
  </sunDrawer>
</template>

<style lang="scss" scoped></style>
