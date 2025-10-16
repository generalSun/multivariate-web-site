<script setup>
import { computed, shallowRef } from 'vue'
import { SingleLineEllipsis } from '@/components/singleLineEllipsis'
import { MultiLineEllipsis } from '@/components/multiLineEllipsis'
import { dialogContents } from '@/components/dialogContainer'
import { useDialog } from '@/hooks/useDialog.jsx'
import { useUserStore } from '@/stores/userStore'
import { USER_STATUS_INFO } from '@/configs/enums'
import { copy } from '@/utils'
import ui from '@/libs/ui'
defineOptions({
  name: 'avatarPopoverContent',
})
const { sunDivider, sunSvgIcon } = ui
const { popoverExposed } = defineProps({
  popoverExposed: {
    type: Object,
  },
})
const { avatarDialogContent } = dialogContents
const userStore = useUserStore()
const { showDialog, updateDialogOptions, resetDialogOptions } = useDialog()
const popoverTopInfo = computed(() => {
  return {
    username: userStore?.userInfo['username'],
    userUniqueCode: userStore?.userInfo['unique_code'],
    status: userStore?.userInfo['status'],
    description: userStore?.userInfo['description'],
  }
})
const popoverBottomList = computed(() => {
  return [
    {
      prefix: 'github',
      text: '查看我的空间',
    },
    {
      prefix: 'github',
      text: '退出登录',
      click: () => {
        userStore?.fetchLogout()
      },
    },
  ]
})
const onClipboardClickHandler = (text) => {
  copy(text)
}
const onOpenStatus = () => {
  popoverExposed.setVisible(false)
  showDialog({
    width: '30%',
    title: '',
    showFooter: false,
    cssModule: 'primary',
    dynamicComponent: shallowRef(avatarDialogContent),
    dynamicProps: {
      updateDialogOptions,
      resetDialogOptions,
    },
  })
}
</script>

<template>
  <div class="avatarPopoverContent">
    <div class="popoverContent popoverTop">
      <SingleLineEllipsis :text="popoverTopInfo.username"></SingleLineEllipsis>
      <div class="avatarStatus">
        <span class="statusBox pointer" @click="onOpenStatus">
          <sunSvgIcon
            :style="{ color: USER_STATUS_INFO[popoverTopInfo.status]?.color }"
            :icon="USER_STATUS_INFO[popoverTopInfo.status]?.icon"
          >
          </sunSvgIcon>
          <span>{{ USER_STATUS_INFO[popoverTopInfo.status]?.label }}</span>
        </span>
      </div>
      <div class="user_id">
        <div>唯一码：</div>
        <SingleLineEllipsis
          class="userIdValue pointer"
          :text="popoverTopInfo.userUniqueCode"
          @click="onClipboardClickHandler"
        ></SingleLineEllipsis>
      </div>
      <MultiLineEllipsis class="description-box" size="small" :content="popoverTopInfo.description"></MultiLineEllipsis>
    </div>
    <sunDivider></sunDivider>
    <div class="popoverContent popoverBottom">
      <template v-for="item in popoverBottomList" :key="item.text">
        <div class="item pointer" @click="item.click(item)">
          <sunSvgIcon :icon="item.prefix"></sunSvgIcon>
          <span>{{ item.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$hover-background-color: #f2f3f5;
.avatarPopoverContent {
  .ui-divider {
    margin: 0;
  }
  .popoverContent {
    padding: 12px;
  }
  .popoverTop {
    background-color: var(--el-fill-color-dark);
    & > :not(:last-child) {
      margin-bottom: 5px;
    }
    .user_id {
      display: flex;
      align-items: center;
      .userIdValue {
        flex: 1;
        &:hover {
          background-color: $hover-background-color;
          border-radius: 2px;
        }
      }
    }
    .avatarStatus {
      & > .statusBox {
        padding: 2px;
        .ui-svg-icon {
          font-size: 14px;
          margin-right: 5px;
        }
        &:hover {
          background-color: $hover-background-color;
          border-radius: 2px;
        }
      }
    }
    .description-box {
      height: 3em; /* 默认高度（会被外部覆盖） */
      color: #606266;
    }
  }
  .popoverBottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
    .item {
      display: flex;
      align-items: center;
      padding: 5px;
      &:hover {
        background-color: $hover-background-color;
        border-radius: 2px;
      }
      & > :not(:last-child) {
        margin-right: 10px;
      }
    }
  }
}
</style>
