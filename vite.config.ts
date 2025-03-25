
import { defineConfig, loadEnv, UserConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-vue-components/vite'
import Components from 'unplugin-vue-components/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'
import svgLoader from 'vite-svg-loader'

const autoImportConfig = AutoImport({
  resolvers: [ElementPlusResolver()]
})

const componentsConfig = Components({
  resolvers: [ElementPlusResolver()]
})

export default defineConfig(({ mode }): UserConfig => {
  loadEnv(mode, process.cwd(), '')

  return {
    build: {
      target: ['es2015', 'chrome63', 'edge79', 'firefox67', 'safari12'],
      polyfillDynamicImport: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', 'vue-router', 'pinia']
          }
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      svgLoader(),
      vueDevTools(),
      autoImportConfig,
      componentsConfig,
      basicSsl()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        styles: fileURLToPath(new URL('./src/assets/styles', import.meta.url)),
        'mock-images': fileURLToPath(new URL('./public/mock-images', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "styles/variables/index.scss" as *;
            @use "styles/mixins/index.scss" as *;
          `,
          api: 'modern-compiler'
        }
      },
      postcss: {
        plugins: [
          require('autoprefixer'),
          require('postcss-flexbugs-fixes')
        ]
      }
    },
    server: {
      https: true,
      host: '0.0.0.0',
      port: 8080,
      cors: true
    }
  }
})
