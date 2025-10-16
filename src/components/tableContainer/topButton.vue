<script setup>
import { computed, ref, shallowRef, watch } from 'vue'
import { isType } from '@/utils'
import { settingsConfig } from './config'
import { useDialog } from '@/hooks/useDialog.jsx'
import { dialogContents } from '@/components/dialogContainer'
import { useFullScreen } from '@/hooks/useFullScreen'
import { sunFullScreen, sunSetting } from '@/libs/ui/icon'
import operateButton from './operateButton.vue'
defineOptions({
  name: 'topButton',
})
const { buttonsConfig, paramsValue, setting, fullScreen, allItemList } = defineProps({
  buttonsConfig: {
    type: [Object, Function],
  },
  paramsValue: {
    type: Object,
    default: () => ({}),
  },
  setting: {
    type: Boolean,
    default: false,
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
  allItemList: {
    type: Array,
    default: () => [],
  },
})
const visibleItemList = defineModel('visibleItemList')
const { showDialog } = useDialog()
const { shuttleContent } = dialogContents
const tableContainerRef = computed(() => {
  return paramsValue?.formInstance
})
const { toggle: toggleFullScreen } = useFullScreen(tableContainerRef)
const buttonsConfigComputed = computed(() => {
  if (isType(buttonsConfig, 'Function')) {
    return buttonsConfig(paramsValue) ?? {}
  } else if (isType(buttonsConfig, 'Object')) {
    return buttonsConfig ?? {}
  }
  return {}
})
const internalButtons = ref({})
watch(
  buttonsConfigComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    internalButtons.value = newVal ?? {}
  },
  { immediate: true, deep: true }
)
const hasButtons = computed(() => {
  return Object.keys(internalButtons.value).length || fullScreen || setting
})
const onSettingClickHandler = () => {
  showDialog({
    width: '45%',
    title: '穿梭框',
    showFooter: true,
    dynamicComponent: shallowRef(shuttleContent),
    dynamicProps: {
      gridAttributes: settingsConfig.gridAttributes,
      gridItemList: settingsConfig.gridItemList,
      showPagination: false,
      leftDataRequest: () => {
        return {
          data: allItemList,
        }
      },
      rightDataRequest: () => {
        return {
          data: visibleItemList.value,
        }
      },
    },
  })
    .then(({ dynamicComponentInstance }) => {
      visibleItemList.value = dynamicComponentInstance?.rightTableData
      const { exposed } = paramsValue ?? {}
      exposed?.clearValidate?.()
    })
    .catch(() => {})
}
const onToggleFullScreenHandler = () => {
  toggleFullScreen()
}
</script>
<template>
  <div v-if="hasButtons" class="topButton">
    <div v-if="Object.keys(internalButtons).length" class="left">
      <template v-for="(item, key) of internalButtons" :key="key">
        <operateButton :buttonInfo="item"></operateButton>
      </template>
    </div>
    <div class="right">
      <sunFullScreen v-if="fullScreen" class="pointerHover" @click="onToggleFullScreenHandler"></sunFullScreen>
      <sunSetting v-if="setting" class="pointerHover" @click="onSettingClickHandler"></sunSetting>
    </div>
  </div>
</template>
<style scoped lang="scss">
.topButton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  .left {
    justify-self: flex-start;
    align-self: flex-end;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    .el-button + .el-button {
      margin-left: 0;
    }
  }
  .right {
    grid-column-start: 2;
    justify-self: flex-end;
    align-self: flex-end;
    padding: 2px;
    & > :not(:last-child) {
      margin-right: 10px;
    }
  }
  svg {
    width: 18px;
  }
}
</style>
