<template>
  <i :class="`element-icons el-icon-${iconClassName} ${className?.join(' ')}`"> </i>
</template>

<script setup>
import { computed } from 'vue'
import { useCommonStore } from '@/stores/commonStore.js'

defineOptions({
  name: 'svgIcon',
})
const { icon, type } = defineProps({
  icon: {
    type: [String, Array, Object],
    required: true,
  },
  type: {
    // 'primary' | 'success' | 'warning' | 'danger' | 'info'
    type: String,
    default: '',
  },
})
const commonStore = useCommonStore()
const darkModeInfo = commonStore?.darkModeInfo ?? {}
const iconClassName = computed(() => {
  if (typeof icon === 'string') {
    return icon
  } else if (Array.isArray(icon)) {
    return darkModeInfo?.isDark ? icon[0] : icon[1]
  }
  const iconElement = icon[darkModeInfo?.modeLabel]
  if (!iconElement) {
    throw new Error(`the icon in ${darkModeInfo?.modeLabel} mode is missing`)
  }
  return iconElement
})
const className = computed(() => {
  const result = ['ui-svg-icon']
  if (type) {
    result.push(type)
  }
  return result
})
</script>

<style lang="scss" scoped>
.element-icons {
  font-size: 24px;
  &.primary {
    color: var(--el-color-primary);
  }
  &.success {
    color: var(--el-color-success);
  }
  &.warning {
    color: var(--el-color-warning);
  }
  &.danger {
    color: var(--el-color-danger);
  }
  &.info {
    color: var(--el-color-info);
  }
}
</style>
