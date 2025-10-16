export const routes = {
  system: {
    path: '/system',
    name: 'system',
    component: () => import('@/views/system/index.vue'),
  },
  auth: {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/index.vue'),
  },
  audit: {
    path: '/audit',
    name: 'audit',
    component: () => import('@/views/audit/index.vue'),
  },
}
