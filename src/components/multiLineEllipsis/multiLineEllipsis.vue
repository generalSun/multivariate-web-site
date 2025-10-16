<template>
  <div class="multiLineEllipsis">
    <sunTooltip :content="content" :disabled="!showTooltip" placement="top" effect="light">
      <sunText ref="sunTextRef" title=" " :line-clamp="cline" :size="size">
        {{ content }}
      </sunText>
    </sunTooltip>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import ui from '@/libs/ui'

defineOptions({
  name: 'multiLineEllipsis',
})
const DEFAULT_LINE_HEIGHT = 20 // 默认行高兜底值
const { sunTooltip, sunText } = ui
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  line: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    default: 'small',
  },
})
const sunTextRef = useTemplateRef('sunTextRef')
const cline = ref(0)
const showTooltip = ref(false)
let resizeObserver = null
const textInstance = computed(() => {
  return sunTextRef.value?.getUIRef?.() ?? sunTextRef.value
})
const calculateClamp = async () => {
  if (!textInstance.value) return
  const style = getComputedStyle(textInstance.value.$el)
  const height = parseFloat(style.height)
  const lineHeight = parseFloat(style.lineHeight) ?? parseFloat(style.fontSize) * 1.5
  // 计算有效行数
  const validLineHeight = lineHeight > 0 ? lineHeight : DEFAULT_LINE_HEIGHT
  const maxLines = Math.max(1, Math.floor(height / validLineHeight))
  cline.value = props.line > 0 ? Math.min(props.line, maxLines) : maxLines
  // 检测溢出
  await nextTick()
  checkOverflow()
}

const checkOverflow = () => {
  if (!textInstance.value) return
  const el = textInstance.value.$el
  showTooltip.value = el.scrollHeight > el.clientHeight
}

onMounted(() => {
  calculateClamp()
  if (ResizeObserver) {
    resizeObserver = new ResizeObserver(calculateClamp)
    if (textInstance.value) {
      resizeObserver.observe(textInstance.value.$el)
    }
  }
})
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
watch([() => props.content, () => props.line], calculateClamp)
</script>

<style scoped lang="scss">
.multiLineEllipsis {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  .ui-text {
    width: 100%;
    max-height: 100%;
  }
}
</style>
