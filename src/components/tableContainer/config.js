import { readonly } from 'vue'

export const columnFiledList = readonly([
  'type',
  'index',
  'label',
  'columnKey',
  'prop',
  'width',
  'minWidth',
  'fixed',
  'renderHeader',
  'sortable',
  'sortMethod',
  'sortBy',
  'sortOrders',
  'resizable',
  'formatter',
  'showOverflowTooltip',
  'align',
  'headerAlign',
  'className',
  'labelClassName',
  'selectable',
  'reserveSelection',
  'filters',
  'filterPlacement',
  'filterClassName',
  'filterMultiple',
  'filterMethod',
  'filteredValue',
  'tooltipFormatter ',
])

export const settingsConfig = readonly({
  gridAttributes: {},
  gridItemList: [
    { type: 'index' },
    {
      type: 'selection',
      reserveSelection: true,
      selectable: (row) => {
        return row.isSelectable ?? true
      },
    },
    {
      prop: 'label',
      label: '字段名',
      filterMethod(value, row, column) {
        const property = column['property']
        return row[property]?.toLowerCase().includes(value.toLowerCase())
      },
    },
    { prop: 'prop', label: '属性名' },
  ],
})

export const getFormItemProp = (row, key) => {
  return `tableData.${row}.${key}`
}
