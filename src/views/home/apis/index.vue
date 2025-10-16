<script setup lang="jsx">
import { useTemplateRef, onMounted, shallowRef, onBeforeUnmount, defineComponent, ref, markRaw, computed } from 'vue'
import { dialogContents } from '@/components/dialogContainer'
import { drawerContents } from '@/components/drawerContainer'
import { tableContainer } from '@/components/tableContainer'
import loadingSrc from '@/assets/images/loading.svg'
import { EVENT_BUS_NAMES, OPERATE_STATUS, PROJECT_STATUS } from '@/configs/enums'
import { useDialog } from '@/hooks/useDialog.jsx'
import { useDrawer } from '@/hooks/useDrawer.jsx'
import emitter from '@/utils/eventBus'
import { apisConfig } from './config/index.jsx'
import service from '@/libs/axios'
import { useUserStore } from '@/stores/userStore.js'
import ui from '@/libs/ui'
import { sunView } from '@/libs/ui/icon.js'
import { deleteModules, getModules } from '@/libs/axios/modules/api.js'
import * as XLSX from 'xlsx'
defineOptions({
  name: 'apisView',
})
const { sunInput, sunLink, sunMessage, sunImage } = ui
const { showDialog } = useDialog()
const { showDrawer } = useDrawer()
const { apiDetailContent, requestHeaderContent, importMappingDetailContent } = dialogContents
const { apiHistoryContent } = drawerContents
const { gridAttributes, gridItemList } = apisConfig
const showLoading = ref(false)
const domainValue = ref('')
const parentInfo = ref({})
domainValue.value = import.meta.env.VITE_APP_BASE_DOMAIN
const userStore = useUserStore()
const username = computed(() => {
  const { userInfo } = userStore ?? {}
  const { username } = userInfo ?? {}
  return username ?? ''
})
const tableContainerRef = useTemplateRef('tableContainerRef')
const dataRequest = async () => {
  try {
    const res = await getModules({ parent_id: parentInfo.value.id })
    const { data } = res ?? {}
    return {
      data: data.map((item) => {
        return { ...item, rowStatus: OPERATE_STATUS.view.value }
      }),
      total: data.length,
    }
  } catch {
    return {
      data: [],
      total: 0,
    }
  }
}
const buttonsConfig = () => {
  return {
    domain: {
      component: markRaw(
        defineComponent({
          components: { sunInput },
          render() {
            return (
              <div style="display:flex;align-items: center;">
                <span style="word-break: keep-all;">域名：</span>
                <sunInput vModel={domainValue.value}></sunInput>
              </div>
            )
          },
        })
      ),
    },
    commonHeaders: {
      label: '公共请求头',
      onClick: () => {
        showDialog({
          width: '60%',
          title: '公共请求头',
          showFooter: true,
          dynamicComponent: shallowRef(requestHeaderContent),
        }).catch(() => {})
      },
    },
    addModule: {
      label: '新增模块',
      onClick: () => {
        tableContainerRef.value.addRow({
          rowStatus: OPERATE_STATUS.create.value,
          status: PROJECT_STATUS.enabled.value,
          personResponsible: username.value,
        })
      },
    },
    deleteModule: {
      label: '删除模块',
      onClick: () => {
        const selections = tableContainerRef.value.getSelections()
        if (selections.length) {
          selections.forEach((row) => {
            if (row.rowStatus !== OPERATE_STATUS.create.value) {
              deleteModules(row.id).then(() => {
                tableContainerRef.value.deleteRow(row)
              })
            } else {
              tableContainerRef.value.deleteRow(row)
            }
          })
        } else {
          sunMessage.warning('请先选择要删除的模块！')
        }
      },
    },
    importModule: {
      label: '导入项目',
      onClick: onImportProjectHandler,
    },
  }
}
const onImportProjectHandler = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.xls,.xlsx'
  input.multiple = false
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (!file) {
      sunMessage.warning('请先选择要要导入的文件！')
      return
    }
    const extension = file.name.split('.').pop()
    if (!['json', 'xls', 'xlsx'].includes(extension)) {
      sunMessage.warning('导入的文件格式为json、xls、xlsx！')
      return
    }
    const reader = new FileReader()
    if (['json'].includes(extension)) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
    reader.onload = async (event) => {
      try {
        const { result } = event.target ?? {}
        let importData
        if (['json'].includes(extension)) {
          importData = JSON.parse(result) ?? {}
        } else {
          const data = new Uint8Array(result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) // header: 1 表示第一行作为表头
          const tableHeaders = jsonData[0]
          importData = jsonData.slice(1).map((row) => {
            return tableHeaders.reduce((obj, header, index) => {
              obj[header] = row[index] || ''
              return obj
            }, {})
          })
        }
        const res = await showDialog({
          width: '60%',
          title: '字段映射',
          showFooter: true,
          dynamicComponent: shallowRef(importMappingDetailContent),
          dynamicProps: {
            importData: importData,
          },
          confirmInterceptor({ dynamicComponentInstance }) {
            const { validate } = dynamicComponentInstance ?? {}
            return validate?.()
          },
        }).catch(() => {
          return Promise.reject(new Error('取消导入'))
        })
        const { paramsValue } = res ?? {}
        const { project, module } = paramsValue ?? {}
        const item = {}
        Object.keys(project).forEach((key) => {
          item[key] = importData[project[key]]
        })
        console.log(project, module)
      } catch (e) {
        sunMessage.error(`导入失败:${e.message ?? e}`)
      }
    }
  }
  input.click()
}
const onViewHistoryClickHandler = (dynamicComponentInstance) => {
  const { detailFormRef, domainFormRef } = dynamicComponentInstance ?? {}
  const detailFormData = detailFormRef?.formValue
  const domainFormData = domainFormRef?.formValue
  showDrawer({
    title: '历史记录',
    showFooter: false,
    size: '50%',
    dynamicComponent: shallowRef(apiHistoryContent),
    dynamicProps: {
      info: {
        method: detailFormData?.method,
        path: detailFormData?.path,
        domain: domainFormData?.domain,
      },
    },
  }).catch(() => {})
}
const onShowApiDetailHandler = (params) => {
  const { scoped, paramsValue } = params ?? {}
  const { additionalAttributes } = paramsValue ?? {}
  const { parentInfo } = additionalAttributes ?? {}
  showDialog({
    width: '60%',
    title: 'api详情',
    showFooter: true,
    headerComponent: markRaw(
      defineComponent({
        components: { sunView, sunLink },
        props: ['title', 'dynamicComponentInstance'],
        render() {
          const { title, dynamicComponentInstance } = this
          const { isCompleteApi } = dynamicComponentInstance ?? {}
          const type = 'primary'
          const underline = false
          const style = {
            'margin-left': '10px',
          }
          const viewStyle = {
            width: '14px',
            height: '14px',
          }
          return (
            <div>
              <span>{title}</span>
              {isCompleteApi ? (
                <sunLink
                  type={type}
                  underline={underline}
                  style={style}
                  onclick={() => onViewHistoryClickHandler(dynamicComponentInstance)}
                >
                  历史记录<sunView style={viewStyle}></sunView>
                </sunLink>
              ) : (
                ''
              )}
            </div>
          )
        },
      })
    ),
    dynamicComponent: shallowRef(apiDetailContent),
    dynamicProps: {
      info: scoped?.row,
      domainValue: domainValue.value,
      parentPath: parentInfo?.path,
    },
    buttonsConfig({ dynamicComponentInstance }, { confirm, cancel }) {
      const { requestHeaderRef, detailFormRef, domainFormRef } = dynamicComponentInstance ?? {}
      const { tableContainerRef } = requestHeaderRef ?? {}
      const detailFormData = detailFormRef?.formValue
      const domainFormData = domainFormRef?.formValue
      const tableData = tableContainerRef?.tableData
      return {
        loading: {
          show: showLoading.value,
          component: defineComponent({
            render() {
              const style = {
                width: '40px',
                height: '40px',
                'margin-right': '12px',
              }
              return <sunImage style={style} src={loadingSrc}></sunImage>
            },
          }),
        },
        confirm: {
          ...confirm,
          show: !!(detailFormData?.method && domainFormData?.domain),
          label: showLoading.value ? '断开' : '连接',
          async onClick() {
            try {
              showLoading.value = !showLoading.value
              if (showLoading.value) {
                const headers = { 'X-Target-Url': domainFormData?.domain }
                tableData?.forEach((item) => {
                  const { key, value } = item ?? {}
                  headers[key] = value
                })
                const method = detailFormData?.method?.toLowerCase()
                let res
                if (method === 'get') {
                  res = await service[method](`${import.meta.env.VITE_APP_WEB_DOMAIN}${detailFormData?.path}`, {
                    headers: headers,
                  })
                } else {
                  res = await service[method](
                    `${import.meta.env.VITE_APP_WEB_DOMAIN}${detailFormData?.path}`,
                    {},
                    {
                      headers: headers,
                    }
                  )
                }
                dynamicComponentInstance.setResponseResult(JSON.stringify(res))
                emitter.emit(EVENT_BUS_NAMES.LINE_SUCCESS, { status: 'success', message: '连接成功' })
              }
            } finally {
              showLoading.value = false
            }
          },
        },
        cancel,
      }
    },
  }).catch(() => {})
}
onMounted(() => {
  parentInfo.value = history.state
  tableContainerRef.value.onCurrentChange(1)
  emitter.on(EVENT_BUS_NAMES.SHOW_API_DETAIL, onShowApiDetailHandler)
})
onBeforeUnmount(() => {
  emitter.off(EVENT_BUS_NAMES.SHOW_API_DETAIL, onShowApiDetailHandler)
})
</script>
<template>
  <div class="apisView">
    <tableContainer
      ref="tableContainerRef"
      :additionalAttributes="{ parentInfo }"
      :gridAttributes="gridAttributes"
      :dataRequest="dataRequest"
      :gridItemList="gridItemList"
      :buttonsConfig="buttonsConfig"
    ></tableContainer>
  </div>
</template>
<style scoped lang="scss">
.apisView {
  height: 100%;
  .tableContainer {
    height: 100%;
  }
}
</style>
