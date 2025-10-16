<script setup>
import { computed, ref, watch } from 'vue'
import { isType } from '@/utils'
import ui from '@/libs/ui'
import normalCell from './normalCell.vue'
import expandCell from './expandCell.vue'
import operateCell from './operateCell.vue'
import headerCell from './headerCell.vue'
import { columnFiledList } from './config.js'
defineOptions({
  name: 'tableColumn',
})
const { sunTableColumn, sunRadio, sunText } = ui
const { paramsValue, itemInfo } = defineProps({
  paramsValue: {
    type: Object,
    default: () => ({}),
  },
  itemInfo: {
    type: Object,
    default: () => ({}),
  },
})
const radioModelValue = defineModel('radioModelValue')
const attributesClassification = computed(() => {
  const {
    attributes,
    component,
    componentAttributes,
    editComponent,
    editComponentAttributes,
    filterComponent,
    filterComponentAttributes,
    ...args
  } = itemInfo ?? {}
  const columnProps = {}
  const customProps = {}
  Object.keys(args).forEach((key) => {
    if ((columnFiledList ?? []).includes(key)) {
      columnProps[key] = args[key]
    } else {
      customProps[key] = args[key]
    }
  })
  return {
    attributes,
    component,
    componentAttributes,
    editComponent,
    editComponentAttributes,
    filterComponent,
    filterComponentAttributes,
    columnProps,
    customProps,
  }
})
const customPropsClassification = computed(() => {
  const { customProps } = attributesClassification.value ?? {}
  const { edit, rules, buttonsConfig, headerTip, filterable, filterValue, ...args } = customProps ?? {}
  return {
    edit,
    rules,
    buttonsConfig,
    headerTip,
    filterable,
    filterValue,
    attributes: args,
  }
})
const columnAttributesComputed = computed(() => {
  const { attributes } = attributesClassification.value ?? {}
  if (isType(attributes, 'Function')) {
    return attributes(paramsValue) ?? {}
  } else if (isType(attributes, 'Object')) {
    return attributes ?? {}
  }
  return {}
})
const internalColumnAttributes = ref({})
const defaultColumnAttributes = {
  showOverflowTooltip: true,
}
watch(
  columnAttributesComputed,
  (newVal, oldValue) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldValue)) {
      return
    }
    const { columnProps } = attributesClassification.value ?? {}
    internalColumnAttributes.value = { ...defaultColumnAttributes, ...columnProps, ...newVal }
    if (internalColumnAttributes.value.type === 'radio') {
      internalColumnAttributes.value.width ??= '48'
    }
    if (internalColumnAttributes.value.type === 'operate') {
      internalColumnAttributes.value.showOverflowTooltip = false
    }
    internalColumnAttributes.value.columnKey ??= internalColumnAttributes.value.prop
    if (internalColumnAttributes.value.columnKey) {
      internalColumnAttributes.value.filterMethod ??= (value, row, column) => {
        const property = column['property']
        return row[property]?.toLowerCase().includes((value ?? '').toLowerCase())
      }
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <sunTableColumn v-bind="internalColumnAttributes">
    <template v-if="internalColumnAttributes.type === 'index'" v-slot:default="scoped">
      <sunText>{{
        scoped.$index +
        1 +
        (paramsValue.paginationAttributes.currentPage - 1) * paramsValue.paginationAttributes.pageSize
      }}</sunText>
    </template>
    <template v-else-if="internalColumnAttributes.type === 'radio'" v-slot:default="scoped">
      <sunRadio v-model="radioModelValue" :value="JSON.stringify(scoped.row)"></sunRadio>
    </template>
    <template v-else-if="internalColumnAttributes.type === 'expand'" v-slot:default="scoped">
      <expandCell
        :scoped="scoped"
        :paramsValue="paramsValue"
        :component="attributesClassification.component"
        :customProps="customPropsClassification"
        :componentAttributes="attributesClassification.componentAttributes"
      ></expandCell>
    </template>
    <template v-else-if="internalColumnAttributes.type === 'operate'" v-slot:default="scoped">
      <operateCell :scoped="scoped" :paramsValue="paramsValue" :customProps="customPropsClassification"></operateCell>
    </template>
    <template v-else-if="internalColumnAttributes.prop" v-slot:default="scoped">
      <normalCell
        v-model="scoped.row[internalColumnAttributes.prop]"
        :scoped="scoped"
        :paramsValue="paramsValue"
        :component="attributesClassification.component"
        :customProps="customPropsClassification"
        :componentAttributes="attributesClassification.componentAttributes"
        :editComponent="attributesClassification.editComponent"
        :editComponentAttributes="attributesClassification.editComponentAttributes"
      ></normalCell>
    </template>
    <template v-slot:header="scoped">
      <headerCell
        :scoped="scoped"
        :paramsValue="paramsValue"
        :customProps="customPropsClassification"
        :columnAttributes="internalColumnAttributes"
        :filterComponent="attributesClassification.filterComponent"
        :filterComponentAttributes="attributesClassification.filterComponentAttributes"
      ></headerCell>
    </template>
  </sunTableColumn>
</template>

<style scoped lang="scss">
.ui-radio {
  :deep(.el-radio__label) {
    padding: unset;
  }
}
</style>
