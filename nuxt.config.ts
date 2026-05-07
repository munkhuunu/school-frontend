export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      apiBase: 'https://1lc7o3pgg0.execute-api.ap-northeast-1.amazonaws.com/Prod'
    }
  },
  app: {
    head: {
      title: 'Сургуулийн удирдлагын систем',
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
