import ui from '@/libs/ui'
import { OPERATE_STATUS, PROJECT_STATUS } from '@/configs/enums.js'

const { sunRadioGroup } = ui
export const formAttributes = () => {
  return {
    labelPosition: 'right',
    labelWidth: '100px',
    rules: {
      name: [{ required: true, trigger: 'blur', message: '项目名称是必填项' }],
      status: [{ required: true, trigger: 'blur', message: '项目状态是必填项' }],
      created_by: [{ required: true, trigger: 'blur', message: '项目创建者是必填项' }],
      updated_by: [{ required: true, trigger: 'blur', message: '项目责任人是必填项' }],
    },
    layout: {
      col: 2,
    },
  }
}

export const formItemList = [
  {
    prop: 'name',
    label: '项目名称',
    placeholder: '请输入项目名称',
    componentProps({ paramsValue }) {
      const { additionalAttributes } = paramsValue ?? {}
      const { status } = additionalAttributes ?? {}
      return {
        disabled: status !== OPERATE_STATUS.create.value,
      }
    },
  },
  { prop: 'base_url', label: '项目地址', placeholder: '请输入项目地址' },
  {
    prop: 'status',
    label: '项目状态',
    placeholder: '请输入项目状态',
    component: sunRadioGroup,
    radioList: Object.values(PROJECT_STATUS),
  },
  {
    prop: 'description',
    label: '项目描述',
    placeholder: '请输入项目描述内容',
    type: 'textarea',
    autosize: true,
    layout: { span: 2 },
  },
  {
    prop: 'created_by',
    label: '项目创建者',
    placeholder: '请输入项目创建者',
    disabled: true,
    isExist({ formValue }) {
      const { created_by } = formValue ?? {}
      return created_by
    },
  },
  { prop: 'updated_by', label: '项目责任人', placeholder: '请输入项目责任人' },
]
