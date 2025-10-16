<script setup>
import { ref, shallowRef, onMounted, computed } from 'vue'
import ui from '@/libs/ui'
import { paste } from '@/utils'
import { v4 as uuidV4 } from 'uuid'
import { useRouter } from 'vue-router'
import { SingleLineEllipsis } from '@/components/singleLineEllipsis'
import { sunPlus, sunSetting } from '@/libs/ui/icon.js'
import { useDialog } from '@/hooks/useDialog.jsx'
import { dialogContents } from '@/components/dialogContainer'
import { createModules, deleteModules, getModules, updateModules } from '@/libs/axios/modules/api.js'
import { useUserStore } from '@/stores/userStore.js'
import { OPERATE_STATUS } from '@/configs/enums.js'
defineOptions({
  name: 'asideComponent',
})
const { sunInput, sunButton, sunMessageBox, sunMessage } = ui
const { isCollapse } = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})
const { showDialog } = useDialog()
const { addProjectContent } = dialogContents
const router = useRouter()
const searchValue = ref('')
const isLoading = ref(false)
const activeItem = ref('')
const asideList = ref([])
const userStore = useUserStore()
const username = computed(() => {
  const { userInfo } = userStore ?? {}
  const { username } = userInfo ?? {}
  return username ?? ''
})
const onPasteHandler = async () => {
  searchValue.value = await paste()
}
const onAddProjectHandler = async () => {
  await showDialog({
    width: '60%',
    title: '添加项目',
    showFooter: true,
    dynamicComponent: shallowRef(addProjectContent),
    dynamicProps: {
      initialFormValue: { created_by: username, updated_by: username, status: 'enabled' },
      status: OPERATE_STATUS.create.value,
    },
    async confirmInterceptor({ dynamicComponentInstance }) {
      const { formContainerRef } = dynamicComponentInstance ?? {}
      const res = await formContainerRef?.validate()
      const list = asideList.value.filter((d) => d.name === res.name)
      if (list.length) {
        sunMessage.error('该项目已存在')
        return Promise.reject(new Error('该项目已存在'))
      }
      return res
    },
    buttonsConfig({}, { confirm, cancel }) {
      return {
        create: { ...confirm, label: '创建' },
        cancel,
      }
    },
  })
    .then(async ({ paramsValue }) => {
      try {
        const res = await createModules(paramsValue)
        const { data } = res ?? {}
        data.id ??= uuidV4()
        asideList.value.push(data)
        onItemClickHandler(data)
      } catch (e) {
        console.log(e)
      }
    })
    .catch(() => {})
}
const onShowProjectDetailHandler = async (item) => {
  await showDialog({
    width: '60%',
    title: '项目详情',
    showFooter: true,
    dynamicComponent: shallowRef(addProjectContent),
    dynamicProps: { initialFormValue: item, status: OPERATE_STATUS.update.value },
    confirmInterceptor() {
      let _resolve
      const promise = new Promise((resolve) => {
        _resolve = resolve
      })
      sunMessageBox.alert('确定要删除该模块吗？', '提示', {
        confirmButtonText: 'OK',
        callback: (action) => {
          if (action === 'confirm') {
            _resolve()
          }
        },
      })
      return promise
    },
    buttonsConfig({ dynamicComponentInstance }, { confirm }) {
      const { formContainerRef } = dynamicComponentInstance ?? {}
      const { isInitialValueChanged } = formContainerRef ?? {}
      return {
        delete: { ...confirm, label: '删除' },
        update: {
          label: '更新',
          type: 'primary',
          disabled: !isInitialValueChanged,
          onClick() {
            const { formContainerRef } = dynamicComponentInstance ?? {}
            formContainerRef?.validate().then((formValue) => {
              updateModules(item.id, formValue).then((res) => {
                const { data } = res ?? {}
                Object.assign(item, data)
              })
            })
          },
        },
      }
    },
  })
    .then(async () => {
      try {
        await deleteModules(item.id)
        const index = asideList.value.findIndex((d) => d.id === item.id)
        if (index >= 0) {
          asideList.value.splice(index, 1)
          onItemClickHandler(asideList.value[index] ?? asideList.value[0])
        }
      } catch (e) {
        console.log(e)
      }
    })
    .catch(() => {})
}
const onItemClickHandler = (item) => {
  if (!item) {
    router.push({ name: 'home' })
    return
  }
  const { id } = item ?? {}
  activeItem.value = id
  router.push({ name: 'apis', state: item, params: { parent_id: id } })
}
onMounted(() => {
  getModules()
    .then((res) => {
      const { data } = res ?? {}
      asideList.value = data ?? []
    })
    .finally(() => {
      onItemClickHandler(asideList.value[0])
    })
})
</script>

<template>
  <div v-loading="isLoading" :class="['asideComponent', { collapse: isCollapse }]">
    <div class="asideTop">
      <sunInput v-model="searchValue" size="small" placeholder="搜索" @paste="onPasteHandler"></sunInput>
      <sunButton size="small" type="primary" :icon="sunPlus" title="添加项目" @click="onAddProjectHandler"></sunButton>
    </div>
    <div class="asideContent">
      <div
        v-for="item of asideList"
        :key="item.id"
        class="asideItem pointerHover"
        :class="{ isActive: activeItem === item.id, isCollapseItem: isCollapse }"
        :title="item.description"
        @click="onItemClickHandler(item)"
      >
        <SingleLineEllipsis class="itemTitle" :text="item.name"></SingleLineEllipsis>
        <sunSetting class="itemIcon" @click="onShowProjectDetailHandler(item)"></sunSetting>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.asideComponent {
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  &.collapse {
    .asideTop {
      gap: 0;
      .ui-input {
        width: 0;
        overflow: hidden;
        transition: all 0.3s ease;
      }
    }
  }
  .asideTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .asideContent {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .asideItem {
      position: relative;
      border: 1px solid darkgrey;
      border-radius: 5px;
      padding: 5px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.isCollapseItem {
        .itemIcon {
          position: absolute;
          right: -10px;
          bottom: -10px;
        }
      }
      .itemTitle {
        flex: 1;
        overflow: hidden;
      }
      .itemIcon {
        height: 60%;
      }
      &.isActive {
        background-color: var(--el-color-primary);
      }
    }
  }
  & > :not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
