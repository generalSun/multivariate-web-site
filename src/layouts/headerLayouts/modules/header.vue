<script setup>
import { computed, ref, getCurrentInstance } from 'vue'
import { popoverContainer, popoverContents } from '@/components/popoverContainer'
import logoSrc from '@/assets/images/element-plus-logo.svg'
import { sunSunnyIcon, sunMoonIcon } from '@/libs/ui/icon'
import { LANGUAGE, USER_STATUS_INFO } from '@/configs/enums'
import { useCommonStore } from '@/stores/commonStore.js'
import { useUserStore } from '@/stores/userStore'
import ui from '@/libs/ui'
defineOptions({
  name: 'headerComponent',
})
const { avatarPopoverContent } = popoverContents
const { sunSwitch, sunImage, sunAvatar, sunSvgIcon } = ui
const userStore = useUserStore()
const commonStore = useCommonStore()
const languageInfo = commonStore?.languageInfo ?? {}
const darkModeInfo = commonStore?.darkModeInfo ?? {}
const isLightMode = ref(!darkModeInfo?.isDark)
const { proxy } = getCurrentInstance()
const languageIcon = computed(() => {
  return LANGUAGE[languageInfo?.language].icon
})
const userAvatar = computed(() => {
  return userStore?.userInfo['avatar_url'] ?? ''
})
const userStatus = computed(() => {
  return userStore?.userInfo['status'] ?? ''
})
const onModeChange = (value) => {
  // 使用setTimeOut是为了体现切换模式switch组件的动画
  setTimeout(() => {
    const { toggleDark, isDark: darkModelInfo_isDark } = darkModeInfo ?? {}
    //在不支持的浏览器里不做动画
    if (!document.startViewTransition) {
      toggleDark?.(!value)
      return
    }
    // 开始一次视图过渡：
    const transition = document.startViewTransition(() => toggleDark?.(!value))
    transition.ready.then(() => {
      const modeSwitchEl = proxy.$el.querySelector('.modeSwitch')
      const clientRect = modeSwitchEl.getBoundingClientRect()
      const isDark = darkModelInfo_isDark
      const x = clientRect.left + clientRect.width / 2
      const y = clientRect.top + clientRect.height / 2
      //计算按钮到最远点的距离用作裁剪圆形的半径
      const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      //开始动画
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      )
    })
  }, 200)
}
const onOpenGithub = () => {
  window.open('https://github.com/vuejs/vue-next', '_blank')
}
</script>
<template>
  <div class="headerComponent" :style="{ '--userStatusColor': USER_STATUS_INFO[userStatus]?.color }">
    <div class="headerComponent-left">
      <sunImage :src="logoSrc" fit="fill" />
    </div>
    <div class="headerComponent-right">
      <sunSwitch
        class="modeSwitch"
        v-model="isLightMode"
        inline-prompt
        size="default"
        :active-icon="sunSunnyIcon"
        :inactive-icon="sunMoonIcon"
        @change="onModeChange"
      ></sunSwitch>
      <sunSvgIcon
        class="pointer"
        type="primary"
        :icon="languageIcon"
        @click="() => languageInfo.switchLanguage()"
      ></sunSvgIcon>
      <sunSvgIcon class="pointer" type="primary" icon="github" @click="onOpenGithub"></sunSvgIcon>
      <popoverContainer
        v-if="userStore.hasUserInfo"
        popper-class="header-popover"
        :dynamicComponent="avatarPopoverContent"
      >
        <template #reference>
          <sunAvatar class="referenceAvatar pointer lightning" :src="userAvatar"> </sunAvatar>
        </template>
      </popoverContainer>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.headerComponent {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 0 10px;
  .headerComponent-left {
    height: 100%;
    display: flex;
    align-items: center;
    .ui-image {
      height: 28px;
    }
  }
  .headerComponent-right {
    height: 100%;
    display: flex;
    align-items: center;
    & > :not(:last-child) {
      margin-right: 20px;
    }
    .referenceAvatar {
      box-sizing: content-box;
      transform-origin: center;
      position: relative;
      border-radius: 50%;
      border: 3px solid var(--userStatusColor);
      width: var(--el-avatar-size);
      height: var(--el-avatar-size);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
  }
}
:global(.ui-popover.header-popover) {
  --el-popover-padding: 0;
  width: 300px !important;
}
</style>
