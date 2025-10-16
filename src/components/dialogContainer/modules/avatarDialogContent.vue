<script setup>
import { onUnmounted, ref } from 'vue'
import normalStatusComponent from './avatarDialogContentBox/normal.vue'
import customStatusComponent from './avatarDialogContentBox/custom.vue'
import { useUserStore } from '@/stores/userStore'
defineOptions({
  name: 'avatarDialogContent',
})
const { resetDialogOptions } = defineProps({
  updateDialogOptions: {
    type: Function,
    default: () => {},
  },
  resetDialogOptions: {
    type: Function,
    default: () => {},
  },
})
const userStore = useUserStore()
const status = ref('normal')
userStore?.fetchUserStatus()
onUnmounted(() => {
  resetDialogOptions?.()
})
</script>

<template>
  <div class="avatarDialogContent">
    <normalStatusComponent
      v-if="status === 'normal'"
      :updateDialogOptions="updateDialogOptions"
      @customEmojis="status = 'custom'"
    ></normalStatusComponent>
    <customStatusComponent
      v-else
      :updateDialogOptions="updateDialogOptions"
      @normalEmojis="status = 'normal'"
    ></customStatusComponent>
  </div>
</template>

<style scoped lang="scss">
.avatarDialogContent {
  & > div {
    height: 100%;
  }
}
</style>
