<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import { isType } from '@/utils'
import ui from '@/libs/ui'
import operateButton from './operateButton.vue'
import { sunMore } from '@/libs/ui/icon.js'

defineOptions({
  name: 'operateCell',
})
const { sunPopover } = ui
const { paramsValue, scoped, customProps } = defineProps({
  paramsValue: {
    type: Object,
    default: () => ({}),
  },
  scoped: {
    type: Object,
  },
  customProps: {
    type: Object,
  },
})
const operateCellRef = useTemplateRef('operateCellRef')
const operateRefs = ref()
const popoverButtonKeys = ref()
const internalButtons = ref({})
operateRefs.value = {}
popoverButtonKeys.value = []
const visibleButtonKeys = computed(() => {
  return Object.keys(internalButtons.value ?? {}).filter((key) => {
    return !popoverButtonKeys.value.includes(key)
  })
})
const reactiveValue = computed(() => {
  return {
    paramsValue,
    scoped,
  }
})
const buttonsConfigComputed = computed(() => {
  const { buttonsConfig } = customProps ?? {}
  if (isType(buttonsConfig, 'Function')) {
    return buttonsConfig(reactiveValue.value) ?? {}
  } else if (isType(buttonsConfig, 'Object')) {
    return buttonsConfig ?? {}
  }
  return {}
})
watch(
  buttonsConfigComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    internalButtons.value = newVal ?? {}
    popoverButtonKeys.value = []
  },
  { immediate: true, deep: true }
)
const processOverflow = () => {
  const clientWidth = operateCellRef.value?.clientWidth
  const scrollWidth = operateCellRef.value?.scrollWidth
  if (scrollWidth > clientWidth) {
    const keys = Object.keys(internalButtons.value ?? {})
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i]
      const instance = operateRefs.value[key]
      const index = popoverButtonKeys.value.indexOf(key)
      if (instance?.isExist && instance?.isShow && index < 0) {
        popoverButtonKeys.value.push(key)
        break
      }
    }
  }
}
watch(
  () => operateCellRef.value,
  () => {
    processOverflow()
  },
  {
    immediate: true,
    deep: true,
  }
)
watch(
  () => popoverButtonKeys.value,
  () => {
    setTimeout(() => {
      processOverflow()
    })
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
<template>
  <div ref="operateCellRef" v-if="Object.keys(internalButtons).length" class="operate-cell">
    <template v-for="key of visibleButtonKeys" :key="key">
      <operateButton :ref="(el) => (operateRefs[key] = el)" :buttonInfo="internalButtons[key]"></operateButton>
    </template>
    <sunPopover v-if="popoverButtonKeys.length">
      <div class="popover-container">
        <template v-for="key of popoverButtonKeys" :key="key">
          <operateButton :ref="(el) => (operateRefs[key] = el)" :buttonInfo="internalButtons[key]"></operateButton>
        </template>
      </div>
      <template #reference>
        <div class="more-icon"><sunMore></sunMore></div>
      </template>
    </sunPopover>
  </div>
</template>
<style scoped lang="scss">
.operate-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  .el-button + .el-button {
    margin-left: 0;
  }
  .more-icon {
    overflow: hidden;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 18px;
      height: 18px;
    }
  }
}
.popover-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
