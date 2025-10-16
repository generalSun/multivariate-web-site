import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import ElementPlus from 'unplugin-element-plus/vite'
import ViteMonacoPlugin from 'vite-plugin-monaco-editor'

export default defineConfig(async () => {
  const monacoPlugin = ViteMonacoPlugin?.default ?? ViteMonacoPlugin?.monacoEditorPlugin
  return {
    plugins: [vue(), vueJsx(), vueDevTools(), ElementPlus({ useSource: true }), monacoPlugin({})],
    define: {
      'process.env': {},
      global: {},
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/global.scss" as *;`,
          api: 'modern-compiler', // or 'modern'
        },
      },
    },
    server: {
      proxy: {
        '/hostApi': {
          target: 'http://127.0.0.1:3030',
          //改成这样！！！！
          rewrite: (path) => path.replace(/^\/hostApi/, ''),
          changeOrigin: true,
          // 显示请求代理后的真实地址
          bypass(req = { url: '' }, res = { setHeader: () => {} }, options) {
            const proxyUrl = new URL(req.url || '', options.target)?.href || ''
            res.setHeader('x-res-proxyUrl', proxyUrl)
          },
        },
      },
    },
  }
})
