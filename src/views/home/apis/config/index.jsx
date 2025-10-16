import { EVENT_BUS_NAMES, OPERATE_STATUS, PROJECT_STATUS } from '@/configs/enums'
import describeTableContainer from './../modules/describeTableContainer.vue'
import emitter from '@/utils/eventBus'
import { createModules, deleteModules } from '@/libs/axios/modules/api.js'
import ui from '@/libs/ui'
import { sunView, sunDelete, sunEdit, sunCircleCloseFilled } from '@/libs/ui/icon.js'
import { markRaw } from 'vue'
const { sunInput, sunMessageBox, sunRadioGroup, sunSvgIcon } = ui
export const apisConfig = {
  gridAttributes: {
    setting: true,
    fullScreen: true,
  },
  gridItemList: [
    { type: 'index' },
    { type: 'selection' },
    {
      type: 'expand',
      component: describeTableContainer,
      componentAttributes(params) {
        const { scoped } = params ?? {}
        const { row } = scoped ?? {}
        return {
          describeDetail: row?.describeDetail,
          tableData: row?.children,
          parentInfo: row,
        }
      },
    },
    {
      prop: 'name',
      label: '模块名',
      sortable: true,
      filterable: true,
      rules: ({ paramsValue }) => {
        const { exposed } = paramsValue ?? {}
        return [
          { required: true, message: '请输入模块名' },
          {
            validator: (rule, value, cb) => {
              const { tableData } = exposed ?? {}
              const list = tableData.filter((d) => d.name === value)
              if (list.length > 1) {
                return cb(new Error(`模块名:${value}已存在`))
              }
              cb()
            },
            trigger: 'blur',
          },
        ]
      },
      component({ scoped }) {
        const { row } = scoped ?? {}
        const { rowStatus } = row ?? {}
        return rowStatus !== OPERATE_STATUS.view.value ? sunInput : void 0
      },
    },
    {
      prop: 'description',
      label: '描述',
      sortable: true,
      filterable: true,
      component({ scoped }) {
        const { row } = scoped ?? {}
        const { rowStatus } = row ?? {}
        return rowStatus !== OPERATE_STATUS.view.value ? sunInput : void 0
      },
    },
    {
      prop: 'path',
      label: '路径',
      rules: ({ paramsValue }) => {
        const { exposed } = paramsValue ?? {}
        return [
          { required: true, message: '路径是必填项' },
          {
            validator: (rule, value, cb) => {
              const { tableData } = exposed ?? {}
              const list = tableData.filter((d) => d.path === value)
              if (list.length > 1) {
                return cb(new Error(`路径:${value}已存在`))
              }
              cb()
            },
            trigger: 'blur',
          },
        ]
      },
      component({ scoped }) {
        const { row } = scoped ?? {}
        const { rowStatus } = row ?? {}
        return rowStatus !== OPERATE_STATUS.view.value ? sunInput : void 0
      },
    },
    {
      prop: 'personResponsible',
      label: '责任人',
      component({ scoped }) {
        const { row } = scoped ?? {}
        const { rowStatus } = row ?? {}
        return rowStatus !== OPERATE_STATUS.view.value ? sunInput : void 0
      },
    },
    {
      prop: 'status',
      label: '状态',
      component({ scoped }) {
        const { row } = scoped ?? {}
        const { rowStatus } = row ?? {}
        return rowStatus !== OPERATE_STATUS.view.value ? sunRadioGroup : void 0
      },
      radioList: Object.values(PROJECT_STATUS),
    },
    { prop: 'updated_at', label: '更新时间' },
    { prop: 'created_at', label: '创建时间' },
    {
      type: 'operate',
      label: '操作',
      width: '150',
      buttonsConfig(params) {
        const { scoped, paramsValue } = params ?? {}
        const { exposed, additionalAttributes } = paramsValue ?? {}
        const { row, $index } = scoped ?? {}
        const { rowStatus } = row ?? {}
        const { deleteRow, validateRow } = exposed ?? {}
        return {
          view: {
            isExist: rowStatus === OPERATE_STATUS.view.value,
            title: '查看',
            type: 'primary',
            icon: markRaw(sunView),
            circle: true,
            onClick: () => {
              emitter.emit(EVENT_BUS_NAMES.SHOW_API_DETAIL, params)
            },
          },
          delete: {
            isExist: rowStatus === OPERATE_STATUS.view.value,
            title: '删除',
            type: 'primary',
            icon: markRaw(sunDelete),
            circle: true,
            onClick: () => {
              sunMessageBox.alert('确定要删除该模块吗？', '提示', {
                confirmButtonText: 'OK',
                callback: (action) => {
                  if (action === 'confirm') {
                    deleteModules(row.id).then(() => {
                      deleteRow?.(row)
                    })
                  }
                },
              })
            },
          },
          update: {
            isExist: rowStatus === OPERATE_STATUS.view.value,
            title: '修改',
            type: 'primary',
            icon: markRaw(sunEdit),
            circle: true,
            onClick: () => {
              scoped.row.rowStatus = OPERATE_STATUS.update.value
            },
          },
          save: {
            isExist: [OPERATE_STATUS.create.value, OPERATE_STATUS.update.value].includes(rowStatus),
            title: '保存',
            type: 'primary',
            icon: markRaw(<sunSvgIcon style={{ 'font-size': '18px' }} icon={'save'}></sunSvgIcon>),
            circle: true,
            onClick: () => {
              const { parentInfo } = additionalAttributes ?? {}
              const { id } = parentInfo ?? {}
              validateRow?.($index).then(() => {
                createModules({ name: row.name, path: row.path, description: row.description, parent_id: id }).then(
                  (res) => {
                    const { data } = res ?? {}
                    scoped.row.rowStatus = OPERATE_STATUS.view.value
                    scoped.row['created_at'] = data['created_at']
                    scoped.row['updated_at'] = data['updated_at']
                  }
                )
              })
            },
          },
          cancel: {
            isExist: [OPERATE_STATUS.update.value].includes(rowStatus),
            title: '取消',
            type: 'primary',
            icon: markRaw(sunCircleCloseFilled),
            circle: true,
            onClick: () => {
              scoped.row.rowStatus = OPERATE_STATUS.view.value
            },
          },
        }
      },
    },
  ],
}

export const describeConfig = {
  gridAttributes: {},
  gridItemList: [
    { type: 'index' },
    { type: 'selection' },
    { prop: 'name', label: '子模块名' },
    { prop: 'description', label: '描述' },
    { prop: 'path', label: '路径' },
    { prop: 'method', label: '方法' },
    { prop: 'personResponsible', label: '责任人' },
    { prop: 'status', label: '状态' },
    { prop: 'updateTime', label: '更新时间' },
    { prop: 'createTime', label: '创建时间' },
    {
      type: 'operate',
      label: '操作',
      buttonsConfig(params) {
        return {
          view: {
            label: '查看',
            onClick: () => {
              emitter.emit(EVENT_BUS_NAMES.SHOW_API_DETAIL, params)
            },
          },
        }
      },
    },
  ],
}
