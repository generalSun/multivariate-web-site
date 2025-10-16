<script setup lang="jsx">
import { onMounted, ref, h } from 'vue'
import { EMOJIS } from '@/configs/enums.js'
import customHeader from './customHeader.vue'
import { useCloned } from '@/utils/vueUse'
import ui from '@/libs/ui'
defineOptions({
  name: 'avatarDialogContentCustom',
})
const { sunSvgIcon, sunInput } = ui
const { updateDialogOptions } = defineProps({
  updateDialogOptions: {
    type: Function,
    default: () => {},
  },
})
const emits = defineEmits(['normalEmojis'])
const { cloned: emojis } = useCloned(EMOJIS)
const currentEmoji = ref(emojis.value[0])
const onItemClickHandler = (item) => {
  currentEmoji.value = item
}
const onBackClickHandler = () => {
  emits('normalEmojis')
}
onMounted(() => {
  updateDialogOptions?.({
    showFooter: true,
    headerComponent: h(customHeader, { onClick: onBackClickHandler }),
    confirmButtonText: '就这个',
    cancelButtonProps: {
      onClick: () => {
        onBackClickHandler()
        return false
      },
    },
  })
})
</script>

<template>
  <div class="avatarDialogContentCustom">
    <div class="setZone">
      <template v-if="currentEmoji">
        <div class="setZoneBox">
          <sunSvgIcon :style="{ color: currentEmoji.color }" :icon="currentEmoji.icon"></sunSvgIcon>
          <sunInput v-model="currentEmoji.label" :maxlength="8"></sunInput>
        </div>
      </template>
    </div>
    <div class="contentZone">
      <template v-for="item of emojis" :key="item.label">
        <div class="contentItem pointer" :class="{ isActive: currentEmoji === item }" @click="onItemClickHandler(item)">
          <sunSvgIcon :style="{ color: item.color }" :icon="item.icon"></sunSvgIcon>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatarDialogContentCustom {
  margin-top: 5px;
  display: grid;
  grid-template-rows: 1fr 1.5fr;
  grid-row-gap: 10px;
  .setZone {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    background-color: white;
    .setZoneBox {
      text-align: center;
      width: 200px;
      & > :not(:first-child) {
        margin-top: 10px;
      }
      :deep(input) {
        text-align: center;
      }
    }
  }
  .contentZone {
    border-radius: 5px;
    padding: 15px 5px;
    background-color: #fff;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
    grid-auto-rows: min-content;
    gap: 10px;
    overflow: auto;
    /* 针对该容器的滚动条 */
    &::-webkit-scrollbar {
      width: 0;
    }
    .contentItem {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      &:hover,
      &.isActive {
        border-radius: 5px;
        background-color: #5a549347;
      }
    }
  }
  .ui-svg-icon {
    font-size: 14px;
  }
}
</style>
