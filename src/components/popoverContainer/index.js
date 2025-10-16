import popoverContainerComponent from './popoverContainer.vue'
import { importFiles } from '@/utils'
const components = importFiles({
  modules: import.meta.glob('./modules/*.vue', { eager: true }),
})
export const popoverContents = components
export const popoverContainer = popoverContainerComponent
