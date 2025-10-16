import { importFiles } from '@/utils'

// 使用utils中现有的批量导入功能
const directives = importFiles({ modules: import.meta.glob('./modules/*.js', { eager: true }) })

export const registerDirectives = (app) => {
  // 注册全局指令
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key])
  })
}
