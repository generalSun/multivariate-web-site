<script setup>
import { computed, nextTick, ref, useTemplateRef, watch, readonly, markRaw, getCurrentInstance } from 'vue'
import ui from '@/libs/ui'
import formItemMiddleware from './formItemMiddleware.vue'
import { isType } from '@/utils'
import { defaultSize } from '@/configs/config.js'
const { sunForm, sunFormItem, sunButton } = ui
const { formAttributes, additionalAttributes, initialFormValue, buttonsConfig } = defineProps({
  formAttributes: {
    type: [Object, Function],
    default: () => ({}),
  },
  additionalAttributes: {
    type: Object,
    default: () => ({}),
  },
  formItemList: {
    type: Array,
    default: () => [],
    required: true,
  },
  initialFormValue: {
    type: Object,
    default: () => ({}),
  },
  buttonsConfig: {
    type: [Object, Function],
  },
  showButtons: {
    type: Boolean,
    default: true,
  },
})
const currentInstance = getCurrentInstance()
const sunFormRef = useTemplateRef('sunFormRef')
const sunFormItemRef = ref({})
sunFormItemRef.value = {}
const formValue = ref({})
const originalFormValue = ref({})
const isInitialValueChanged = computed(() => {
  return JSON.stringify(formValue.value) !== JSON.stringify(originalFormValue.value)
})
const formInstance = computed(() => {
  return sunFormRef.value?.getUIRef?.()
})
const paramsValue = computed(() => {
  return {
    formValue: formValue.value,
    additionalAttributes: additionalAttributes,
    sunFormRef: sunFormRef.value,
    sunFormItemRef: sunFormItemRef.value,
    exposed: currentInstance.exposed,
  }
})
const defaultButtonsConfig = readonly({
  confirm: {
    isShow: true,
    component: markRaw(sunButton),
    label: '查询',
    type: 'primary',
    onClick: () => {
      validate()
    },
  },
  reset: {
    isShow: true,
    component: markRaw(sunButton),
    label: '重置',
    type: 'primary',
    onClick: () => {
      resetFields()
    },
  },
})
const buttonsInfo = computed(() => {
  if (isType(buttonsConfig, 'Function')) {
    return buttonsConfig(paramsValue.value, defaultButtonsConfig) ?? {}
  } else if (isType(buttonsConfig, 'Object')) {
    return buttonsConfig ?? {}
  }
  return { ...defaultButtonsConfig }
})
const formAttributesComputed = computed(() => {
  if (isType(formAttributes, 'Function')) {
    return formAttributes(paramsValue.value) ?? {}
  } else if (isType(formAttributes, 'Object')) {
    return formAttributes ?? {}
  }
  return {}
})
const internalFormAttributes = ref({})
const formLayout = ref({})
const defaultFormAttributes = {
  size: defaultSize,
  labelWidth: '100px',
  labelPosition: 'right',
  inline: false,
}
watch(
  formAttributesComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    const { layout, ...args } = newVal ?? {}
    internalFormAttributes.value = Object.assign({}, defaultFormAttributes, args)
    formLayout.value = layout ?? {}
  },
  { immediate: true, deep: true }
)
watch(
  () => initialFormValue,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    formValue.value = JSON.parse(JSON.stringify(newVal ?? {}))
    nextTick(() => {
      originalFormValue.value = JSON.parse(JSON.stringify(formValue.value ?? {}))
    })
  },
  { immediate: true, deep: true }
)
const isItemExist = (item = { isExist: () => true }) => {
  if (isType(item.isExist, 'Function')) {
    return item.isExist(paramsValue.value) ?? true
  }
  return item.isExist ?? true
}
const isItemShow = (item = { isShow: () => true }) => {
  if (isType(item.isShow, 'Function')) {
    return item.isShow(paramsValue.value) ?? true
  }
  return item.isShow ?? true
}
const validate = async () => {
  try {
    await formInstance.value?.validate()
    return JSON.parse(JSON.stringify(formValue.value))
  } catch (e) {
    return Promise.reject(e)
  }
}
const validateField = async (props) => {
  try {
    await formInstance.value?.validateField(props)
    return JSON.parse(JSON.stringify(formValue.value))
  } catch (e) {
    return Promise.reject(e)
  }
}
const resetFields = async (props) => {
  try {
    await formInstance.value?.resetFields(props)
    return JSON.parse(JSON.stringify(formValue.value))
  } catch (e) {
    return Promise.reject(e)
  }
}
const clearValidate = async (props) => {
  try {
    await formInstance.value?.clearValidate(props)
    return JSON.parse(JSON.stringify(formValue.value))
  } catch (e) {
    return Promise.reject(e)
  }
}
defineExpose({
  isInitialValueChanged,
  validate,
  validateField,
  resetFields,
  clearValidate,
  get formValue() {
    return formValue.value
  },
})
</script>

<template>
  <sunForm
    ref="sunFormRef"
    :model="formValue"
    :style="{ '--col': formLayout.col ?? 2, '--gutter': `${formLayout.gutter ?? 20}px` }"
    v-bind="internalFormAttributes"
    @submit.prevent
  >
    <template v-for="item of formItemList" :key="item.prop">
      <formItemMiddleware
        v-if="isItemExist(item)"
        v-show="isItemShow(item)"
        v-model="formValue[item.prop]"
        :ref="(el) => (sunFormItemRef[item.prop] = el)"
        :formItem="item"
        :paramsValue="paramsValue"
      >
      </formItemMiddleware>
    </template>
    <sunFormItem v-if="showButtons && Object.keys(buttonsInfo ?? {}).length" class="buttons">
      <slot name="buttons" v-bind="buttonsInfo">
        <component
          v-for="({ component, isShow, ...attributes }, key) of buttonsInfo"
          :key="key"
          v-show="isShow ?? true"
          :is="component ?? sunButton"
          v-bind="attributes"
        ></component>
      </slot>
    </sunFormItem>
  </sunForm>
</template>

<style scoped lang="scss">
.ui-form {
  &:not(.el-form--inline) {
    display: grid;
    grid-template-columns: repeat(var(--col), 1fr);
    column-gap: var(--gutter);
    & > .ui-form-item.buttons {
      grid-column-start: 1;
      grid-column-end: -1;
      :deep(.el-form-item__content) {
        justify-content: center;
      }
    }
  }
}
</style>
