<template>
  <RouterView v-slot="{ Component, route }">
    <template v-if="Component">
      <transition name="fade">
        <KeepAlive v-if="route.meta.keepAlive">
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <div class="loading">Loading settings...</div>
            </template>
          </Suspense>
        </KeepAlive>
        <Suspense v-else>
          <component :is="Component" />
          <template #fallback>
            <div class="loading">Loading settings...</div>
          </template>
        </Suspense>
      </transition>
    </template>
  </RouterView>
</template>
