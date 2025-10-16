import ui from '@/libs/ui'
const { sunInput } = ui
export const detailConfig = {
  formAttributes: () => {
    return {
      layout: {
        col: 2,
      },
    }
  },
  formItemList: [
    { prop: 'name', label: '模块', disabled: true },
    { prop: 'path', label: '完整路径', disabled: true },
    { prop: 'method', label: '方法', disabled: true },
    { prop: 'status', label: '状态', disabled: true },
  ],
}

export const domainConfig = {
  formAttributes: () => {
    return {
      layout: {
        col: 2,
      },
    }
  },
  formItemList: [
    {
      prop: 'domain',
      label: '域名',
      placeholder: '请输入域名',
      componentProps({ paramsValue }) {
        const { additionalAttributes } = paramsValue ?? {}
        const { domainDisabled } = additionalAttributes ?? {}
        return {
          disabled: domainDisabled,
        }
      },
    },
  ],
}

export const headerConfig = {
  gridAttributes: {
    fullScreen: true,
  },
  gridItemList: [
    { type: 'index' },
    { type: 'selection', reserveSelection: true },
    { prop: 'key', label: 'key值', component: sunInput, sortable: true },
    { prop: 'value', label: 'value值', component: sunInput, sortable: true },
  ],
}
