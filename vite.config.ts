import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { loadEnv } from 'vite'
import { ViteMcp } from 'vite-plugin-mcp'
import ServerUrlCopy from 'vite-plugin-url-copy'
import vueDevTools from 'vite-plugin-vue-devtools'

const resolves = dir => {
  return resolve(__dirname, dir)
}
// https://vitejs.dev/config/
const root = process.cwd()

/** @type {import('vite').UserConfig} */
export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv(process.argv[3] === '--mode' ? process.argv[4] : process.argv[3], root)
  } else {
    env = loadEnv(mode, root)
  }
  return {
    resolve: {
      alias: {
        '@': resolves('src'),
      },
    },
    plugins: [
      UnoCSS(),
      ServerUrlCopy(),
      Vue({
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        include: [resolve(__dirname, 'src/locales/**')],
      }),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],

        dirs: ['./src/composables/**', './src/hooks/**', './src/stores/**', './src/api/**'],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts',
      }),
      ViteMcp(),
    ],

    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true',
        },
      },
    },
    server: {
      port: 5700,
      // proxy: {
      //   // 选项写法
      //   '/api': {
      //     target: 'http://127.0.0.1:8000',
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/api/, ''),
      //   },
      // },
      // hmr: {
      //   overlay: false,
      // },
      // host: '0.0.0.0',
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en',
        'axios',
        'qs',
        'echarts',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
      ],
    },
  }
}
