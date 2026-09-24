// https://nuxt.com/docs/api/configuration/nuxt-config

// GA4 measurement ID. Read at build time too: the cookie-control config below
// needs it to name the `_ga_<id>` cookie, and the site is prerendered anyway.
const gtagId = process.env.NUXT_PUBLIC_GTAG_ID ?? ''
const cookiePolicyUrl = 'https://politicalwatch.es/politica-de-cookies/'

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
    '@nuxtjs/i18n',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Nuxt SEO: shared site identity for the sitemap, robots, schema.org and OG image modules
  site: {
    url: 'https://vinculante.ai',
    name: 'Vinculante.ai'
  },

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
      gtagId
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      // Add '/en' back when English is re-enabled
      routes: [
        '/'
      ]
    }
  },

  // Same setup as qhld.es (AEPD tweaks included), extended to English.
  cookieControl: {
    locales: ['es', 'en'],
    // 6-month consent expiry (AEPD guidance) instead of the 1-year default
    cookieExpiryOffsetMs: 1000 * 60 * 60 * 24 * 180,
    barPosition: 'bottom-left',
    // The footer "Cookie settings" link reopens the panel instead of a floating button
    isControlButtonEnabled: false,
    localeTexts: {
      es: {
        // The default says continuing to browse means consent: not valid under the AEPD guide
        bannerDescription: 'Usamos Google Analytics para conocer el impacto de Vinculante.ai y seguir mejorándolo. Solo lo activamos si lo aceptas. Puedes aceptarlo, rechazarlo o configurar tus preferencias, y cambiar de opinión cuando quieras desde el pie de página.',
        // Unambiguous reject labels (defaults: "Acepto lo necesario" / "Rechazar todo")
        decline: 'Rechazar',
        declineAll: 'Rechazar todo'
      },
      en: {
        // The default refers to a floating cookie button, which is disabled here
        bannerDescription: 'We use Google Analytics to understand the impact of Vinculante.ai and keep improving it. We only turn it on if you accept. You can accept, reject or set your preferences, and change your mind at any time from the footer.',
        decline: 'Reject',
        declineAll: 'Reject all',
        manageCookies: 'Settings'
      }
    },
    // Nuxt UI tokens, so the banner and panel follow the site theme (light and dark)
    colors: {
      barBackground: 'var(--ui-bg-elevated)',
      barTextColor: 'var(--ui-text)',
      barButtonBackground: 'var(--ui-primary)',
      barButtonColor: 'var(--ui-bg)',
      barButtonHoverBackground: 'var(--ui-text-highlighted)',
      barButtonHoverColor: 'var(--ui-bg)',
      modalBackground: 'var(--ui-bg-elevated)',
      modalTextColor: 'var(--ui-text)',
      modalButtonBackground: 'var(--ui-primary)',
      modalButtonColor: 'var(--ui-bg)',
      modalButtonHoverBackground: 'var(--ui-text-highlighted)',
      modalButtonHoverColor: 'var(--ui-bg)',
      modalOverlay: 'var(--ui-text-highlighted)',
      modalOverlayOpacity: 0.6,
      modalUnsavedColor: 'var(--ui-bg)',
      checkboxActiveBackground: 'var(--ui-primary)',
      checkboxActiveCircleBackground: 'var(--ui-bg)',
      checkboxInactiveBackground: 'var(--ui-border-accented)',
      checkboxInactiveCircleBackground: 'var(--ui-bg)',
      checkboxDisabledBackground: 'var(--ui-border)',
      checkboxDisabledCircleBackground: 'var(--ui-bg)',
      focusRingColor: 'var(--ui-primary)'
    },
    cookies: {
      necessary: [
        {
          id: 'consent',
          name: { es: 'Preferencias de cookies', en: 'Cookie preferences' },
          description: { es: 'Guardan tu elección en este panel.', en: 'Store your choice in this panel.' },
          targetCookieIds: ['ncc_c', 'ncc_e']
        }
      ],
      optional: [
        {
          id: 'ga',
          name: 'Google Analytics',
          description: { es: 'Cookies de analítica. Nos ayudan a entender cómo se usa el sitio.', en: 'Analytics cookies. They help us understand how the site is used.' },
          // Key is the URL, value the label (qhld.es has them swapped)
          links: { [cookiePolicyUrl]: 'politicalwatch.es/politica-de-cookies' },
          targetCookieIds: ['_ga', ...(gtagId ? [`_ga_${gtagId.replace(/^G-/, '')}`] : [])]
        }
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
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' }
      // Spanish only at launch; uncomment once the English copy is ready
      // { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' }
    ]
  },

  ogImage: {
    // The social card is a static screenshot of the hero: public/og-image.png
    enabled: false
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Political Watch',
      url: 'https://politicalwatch.es',
      logo: 'https://vinculante.ai/logos/political-watch.svg'
    }
  }
})
