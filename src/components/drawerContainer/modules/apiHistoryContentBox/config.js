import ui from '@/libs/ui'
import { SORT_DESCRIPTION } from '@/configs/enums.js'
const { sunDatePicker, sunSelect } = ui
export const formAttributes = () => {
  return {
    labelWidth: '70px',
    layout: {
      col: 2,
    },
  }
}

export const formItemList = [
  {
    prop: 'timeRange',
    label: '时间段',
    component: sunDatePicker,
    componentProps: {
      type: 'datetimerange',
      'range-separator': 'To',
      'start-placeholder': 'Start date',
      'end-placeholder': 'End date',
      shortcuts: [
        {
          text: 'today',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setHours(0, 0, 0, 0)
            return [start, end]
          },
        },
        {
          text: 'Last week',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 7)
            return [start, end]
          },
        },
      ],
      'disabled-date': (data) => {
        const now = new Date()
        const date = new Date(data)
        return now.getTime() <= date.getTime()
      },
    },
  },
  {
    prop: 'sort',
    label: '排序方式',
    component: sunSelect,
    componentProps: {
      optionList: Object.values(SORT_DESCRIPTION),
    },
  },
]
