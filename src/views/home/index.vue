<script setup>
import headerAsideMainFooter from '@/layouts/headerAsideMainFooter.vue'
import { headerComponent } from '@/layouts/headerLayouts'
import { asideComponent } from '@/layouts/asideLayouts'
import { mainComponent } from '@/layouts/mainLayouts'
import { footerComponent } from '@/layouts/footerLayouts'
defineOptions({
  name: 'HomeView',
})
</script>
<template>
  <headerAsideMainFooter direction="horizontal" class="homeView">
    <template #header>
      <headerComponent />
    </template>
    <template #aside="{ isCollapse }">
      <asideComponent :isCollapse="isCollapse" />
    </template>
    <template #main>
      <mainComponent />
    </template>
    <template #footer>
      <footerComponent />
    </template>
  </headerAsideMainFooter>
</template>
<style lang="scss" scoped>
.homeView {
  row-gap: 10px;
  column-gap: 20px;
  :deep(.el-main) {
    --el-main-padding: 0;
  }
  :deep(.el-footer) {
    --el-footer-padding: 0;
  }
}
</style>
