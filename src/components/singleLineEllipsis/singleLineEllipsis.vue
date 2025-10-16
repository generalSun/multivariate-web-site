<template>
  <div class="singleLineEllipsis">
    <sunTooltip :content="text" :disabled="!isEllipsis" placement="top" v-bind="$attrs">
      <sunText ref="sunTextRef" truncated title=" " :size="size" @click="onTextClickHandler(text)">
        {{ text }}
      </sunText>
    </sunTooltip>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, useTemplateRef, computed } from 'vue'
import ui from '@/libs/ui'
import { defaultSize } from '@/configs/config.js'
defineOptions({
  name: 'singleLineEllipsis',
})
const { sunTooltip, sunText } = ui
const { text } = defineProps({
  text: {
    type: String,
    required: true,
    default: '',
  },
  size: {
    type: String,
    default: defaultSize,
  },
})
let resizeObserver = null
const emits = defineEmits(['click'])
const sunTextRef = useTemplateRef('sunTextRef')
const isEllipsis = ref(false)
const textInstance = computed(() => {
  return sunTextRef.value?.getUIRef?.() ?? sunTextRef.value
})
const checkEllipsis = () => {
  if (!textInstance.value) return
  const element = textInstance.value.$el
  isEllipsis.value = element.scrollWidth > element.clientWidth
}
watch(() => text, checkEllipsis)
onMounted(() => {
  checkEllipsis()
  resizeObserver = new ResizeObserver(checkEllipsis)
  if (textInstance.value) {
    resizeObserver.observe(textInstance.value.$el)
  }
})
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
const onTextClickHandler = (text) => {
  emits('click', text)
}
</script>

<style scoped lang="scss">
.singleLineEllipsis {
  max-width: 100%;
  overflow: hidden;
  line-height: 1;
}
</style>
