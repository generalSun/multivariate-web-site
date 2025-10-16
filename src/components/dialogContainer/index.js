import dialogContainerComponent from './dialogContainer.vue'
import { importFiles } from '@/utils'
const components = importFiles({
  modules: import.meta.glob('./modules/*.vue', { eager: true }),
})
export const dialogContents = components
export const dialogContainer = dialogContainerComponent
