// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    '@nuxt/a11y',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@dargmuesli/nuxt-cookie-control',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  runtimeConfig: {
    public: {
      // Mailchimp classic form: the `.../subscribe/post?u=...&id=...` URL
      mailchimpUrl: '',
      // Honeypot field from the Mailchimp embed: `b_<u>_<id>`
      mailchimpHoneypot: '',
      // GDPR "Email" marketing permission ID: `gdpr[<id>]` in the embed
      mailchimpGdprId: '',
      contactEmail: 'hola@politicalwatch.es',
      // Google Analytics 4 measurement ID (`G-...`). Empty: no banner, no analytics.
      gtagId: ''
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      routes: [
        '/',
        '/en'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    baseUrl: 'https://vinculante.ai',
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' }
    ]
  }
})
