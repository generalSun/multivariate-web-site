import ui from '@/libs/ui'
import { GENDER_OPTIONS } from '@/configs/enums.js'
const { sunRadioGroup } = ui
export const formAttributes = () => {
  return {
    labelWidth: '80px',
    layout: {
      col: 2,
    },
    rules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 12, message: '用户名长度在3-12位', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 24, message: '密码长度在6-24位', trigger: 'blur' },
      ],
    },
  }
}

export const formItemList = [
  {
    prop: 'username',
    label: '用户名',
  },
  {
    prop: 'password',
    label: '密码',
  },
  {
    prop: 'name',
    label: '账号名',
  },
  {
    prop: 'gender',
    label: '性别',
    component: sunRadioGroup,
    radioList: Object.values(GENDER_OPTIONS),
  },
  {
    prop: 'phone_number',
    label: '电话号码',
  },
]
