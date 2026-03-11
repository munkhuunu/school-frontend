export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'https://2d7uw32t24.execute-api.ap-northeast-1.amazonaws.com/Prod'
    }
  },
  app: {
    head: {
      title: 'School Management System',
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  },
  css: ['~/assets/css/main.css']
})