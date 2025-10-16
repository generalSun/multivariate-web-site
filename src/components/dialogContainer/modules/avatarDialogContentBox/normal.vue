<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { USER_STATUS_INFO } from '@/configs/enums.js'
import ui from '@/libs/ui'

defineOptions({
  name: 'avatarDialogContentNormal',
})
const { sunSvgIcon } = ui
const { updateDialogOptions } = defineProps({
  updateDialogOptions: {
    type: Function,
    default: () => {},
  },
})
const emits = defineEmits(['customEmojis'])
const userStore = useUserStore()
const friendStatusNumber = ref(0)
const userStatus = computed(() => {
  return userStore?.userInfo['status'] ?? ''
})
const currentEmoji = ref(null)
const emojis = [
  {
    icon: 'jiahao',
    label: '自定义',
    color: 'black',
  },
  ...Object.values(USER_STATUS_INFO),
]
const onItemClickHandler = (item) => {
  if (!item.id) {
    emits('customEmojis')
  } else {
    currentEmoji.value = item
  }
}
watch(
  () => userStatus.value,
  () => {
    const item = USER_STATUS_INFO[userStatus.value] ?? {}
    currentEmoji.value = emojis.find((emoji) => emoji.id === item.id)
  },
  {
    immediate: true,
  }
)
onMounted(() => {
  updateDialogOptions?.({
    title: '',
    headerComponent: null,
    showFooter: false,
    onClosed: () => {
      const item = USER_STATUS_INFO[userStatus.value] ?? {}
      if (currentEmoji.value?.id && currentEmoji.value.id !== item.id) {
        userStore?.updateUserStatus({ status: currentEmoji.value.id })
      }
    },
  })
})
</script>

<template>
  <div class="avatarDialogContentNormal">
    <div class="setZone">
      <div>{{ friendStatusNumber }}个好友设置了状态</div>
    </div>
    <div v-if="currentEmoji" class="statusZone">
      <sunSvgIcon :style="{ color: currentEmoji?.color }" :icon="currentEmoji?.icon"> </sunSvgIcon>
      <span>{{ currentEmoji?.label }}</span>
    </div>
    <div class="contentZone">
      <template v-for="item of emojis" :key="item.id">
        <div
          class="contentItem pointer"
          :class="{ isActive: currentEmoji?.id === item?.id }"
          @click="onItemClickHandler(item)"
        >
          <sunSvgIcon :style="{ color: item.color }" :icon="item.icon"></sunSvgIcon>
          <span>{{ item.label }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatarDialogContentNormal {
  margin-top: 5px;
  display: grid;
  grid-template-rows: 32px 1fr 2fr;
  .setZone {
    text-align: end;
    & > div {
      color: white;
      display: inline-block;
      padding: 5px 10px;
      border-radius: 16px;
      background-color: #5a549347;
    }
  }
  .statusZone {
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    .ui-svg-icon {
      margin-right: 5px;
    }
  }
  .contentZone {
    padding: 15px 5px;
    border-radius: 5px;
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
      flex-direction: column;
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
