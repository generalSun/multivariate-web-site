import drawerContainerComponent from './drawerContainer.vue'
import { importFiles } from '@/utils'
const components = importFiles({
  modules: import.meta.glob('./modules/*.vue', { eager: true }),
})
export const drawerContents = components
export const drawerContainer = drawerContainerComponent
