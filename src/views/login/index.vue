<script setup>
import { ref, shallowRef, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ui from '@/libs/ui'
import { useUserStore } from '@/stores/userStore.js'
import { useDrawer } from '@/hooks/useDrawer.jsx'
import { drawerContents } from '@/components/drawerContainer'
import { isEnv } from '@/utils/index.js'
defineOptions({
  name: 'LoginView',
})
const { sunInput, sunForm, sunFormItem, sunButton } = ui
const router = useRouter()
const { showDrawer } = useDrawer()
const userStore = useUserStore()
const { registerContent } = drawerContents
const loading = ref(false)
const formValue = ref({})
formValue.value = {}
const formItem = ref([
  {
    label: '账号',
    prop: 'username',
  },
  {
    label: '密码',
    prop: 'password',
  },
])
const onLoginBtnClick = () => {
  loading.value = true
  userStore
    ?.fetchLogin(formValue.value)
    .then(() => {
      router.push({ path: '/' })
    })
    .finally(() => {
      loading.value = false
    })
}
const onRegisterBtnClick = () => {
  showDrawer({
    title: '注册账户',
    showFooter: true,
    size: '50%',
    dynamicComponent: shallowRef(registerContent),
    confirmInterceptor: async ({ dynamicComponentInstance }) => {
      try {
        const { registerFormRef } = dynamicComponentInstance ?? {}
        const registerFormValue = await registerFormRef?.validate()
        loading.value = true
        return userStore
          ?.fetchRegister(registerFormValue)
          .then(() => {
            router.push({ path: '/' })
          })
          .finally(() => {
            loading.value = false
          })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  }).catch(() => {})
}
onMounted(() => {
  if (isEnv('development')) {
    router.push({ path: '/' })
  }
})
</script>
<template>
  <div v-loading="loading" class="loginView">
    <sunForm :model="formValue">
      <sunFormItem v-for="item of formItem" :key="item.prop" :prop="item.prop" :label="item.label">
        <sunInput v-model="formValue[item.prop]"></sunInput>
      </sunFormItem>
      <sunFormItem>
        <sunButton @click="onLoginBtnClick">登录</sunButton>
        <sunButton @click="onRegisterBtnClick">注册</sunButton>
      </sunFormItem>
    </sunForm>
  </div>
</template>

<style lang="scss" scoped>
.loginView {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
