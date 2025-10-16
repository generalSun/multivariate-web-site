<script setup>
import { ref, computed } from 'vue'
import ui from '@/libs/ui'
import { sunArrowLeftIcon, sunArrowRightIcon } from '@/libs/ui/icon'
import { defaultHeight } from '@/configs/config.js'
defineOptions({
  name: 'headerAsideMainFooter',
})
const { sunContainer, sunHeader, sunMain, sunAside, sunFooter, sunIcon } = ui
const { direction, headerHeight, asideWidth, asideMinWidth, footerHeight } = defineProps({
  direction: {
    type: String,
    default: 'vertical',
  },
  headerHeight: {
    type: String,
    default: defaultHeight,
  },
  asideWidth: {
    type: String,
    default: '200px',
  },
  asideMinWidth: {
    type: String,
    default: '60px',
  },
  footerHeight: {
    type: String,
    default: '60px',
  },
})
const isCollapse = ref(false)
const asideCurrentWidth = computed(() => {
  return isCollapse.value ? asideMinWidth : asideWidth
})
</script>
<template>
  <sunContainer :direction="direction">
    <sunHeader :height="headerHeight">
      <slot name="header"></slot>
    </sunHeader>
    <sunAside :width="asideCurrentWidth">
      <sunIcon class="arrow pointer" @click="isCollapse = !isCollapse">
        <sunArrowLeftIcon v-if="isCollapse" />
        <sunArrowRightIcon v-else />
      </sunIcon>
      <slot name="aside" v-bind="{ isCollapse }"></slot>
    </sunAside>
    <sunMain>
      <slot name="main"></slot>
    </sunMain>
    <sunFooter :height="footerHeight">
      <slot name="footer"></slot>
    </sunFooter>
  </sunContainer>
</template>
<style lang="scss" scoped>
$asideArrowWidth: 20px;
$transitionTime: 0.3s;
.ui-container {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: v-bind(headerHeight) 1fr v-bind(footerHeight);
  grid-template-columns: v-bind(asideCurrentWidth) 1fr;
  transition: all $transitionTime;
  .ui-header {
    grid-column: 1 / span 2;
    display: flex;
    align-items: center;
  }
  .ui-aside {
    position: relative;
    overflow: unset;
    transition: all $transitionTime;
    .arrow {
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: $asideArrowWidth;
      height: $asideArrowWidth;
      border: 1px solid var(--el-border-color);
      border-radius: 10px;
      background-color: var(--el-color-primary);
      position: absolute;
      top: 50%;
      left: 100%;
    }
  }
  .ui-footer {
    grid-column: 1 / span 2;
    display: flex;
    align-items: center;
  }
}
</style>
