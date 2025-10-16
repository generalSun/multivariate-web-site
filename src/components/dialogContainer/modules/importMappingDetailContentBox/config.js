import ui from '@/libs/ui'
const { sunSelect } = ui
export const formAttributes = () => {
  return {
    labelPosition: 'right',
    labelWidth: '100px',
    layout: {
      col: 3,
    },
  }
}

export const projectFormItemList = [
  {
    prop: 'name',
    label: '项目名称',
    rules: [{ required: true, message: '请选择项目名称' }],
    placeholder: '请输入项目名称',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'base_url',
    label: '项目地址',
    placeholder: '请输入项目地址',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'status',
    label: '项目状态',
    placeholder: '请输入项目状态',
    rules: [{ required: true, message: '请选择项目状态' }],
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'description',
    label: '项目描述',
    placeholder: '请输入项目描述内容',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'created_by',
    label: '项目创建者',
    placeholder: '请输入项目创建者',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'updated_by',
    label: '项目责任人',
    placeholder: '请输入项目责任人',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
]

export const moduleFormItemList = [
  {
    prop: 'name',
    label: '模块名',
    placeholder: '请输入模块名',
    rules: [{ required: true, message: '请选择模块名' }],
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'path',
    label: '路径',
    placeholder: '请输入路径',
    rules: [{ required: true, message: '请选择路径' }],
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'method',
    label: '方法',
    placeholder: '请输入方法',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'status',
    label: '模块状态',
    placeholder: '请输入模块状态',
    rules: [{ required: true, message: '请选择模块状态' }],
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'description',
    label: '模块描述',
    placeholder: '请输入模块描述内容',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'created_by',
    label: '模块创建者',
    placeholder: '请输入模块创建者',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
  {
    prop: 'updated_by',
    label: '模块责任人',
    placeholder: '请输入模块责任人',
    component: sunSelect,
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { optionList } = additionalAttributes ?? {}
      return {
        optionList: optionList,
      }
    },
  },
]
