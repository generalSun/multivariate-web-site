export const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
        },
        children: [
          {
            path: 'apis/:parent_id',
            name: 'apis',
            component: () => import('@/views/home/apis/index.vue'),
            meta: {
              title: 'api',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/accessDenied',
    name: 'accessDenied',
    component: () => import('@/views/accessDenied/index.vue'),
    meta: {
      title: '403',
    },
  },
  {
    path: '/notFound',
    name: 'notFound',
    component: () => import('@/views/notFound/index.vue'),
    meta: {
      title: '404',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404Page',
    component: () => import('@/views/notFound/index.vue'),
  },
]
