import { importFiles } from '@/utils'

const components = importFiles({
  modules: import.meta.glob('./modules/**/index.js', { eager: true }),
})
export default components
