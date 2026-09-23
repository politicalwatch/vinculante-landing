<script setup lang="ts">
const { locale, locales } = useI18n()
const head = useLocaleHead()

useHead(() => ({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#faf7f2' },
    ...(head.value.meta ?? [])
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ...(head.value.link ?? [])
  ],
  htmlAttrs: {
    lang: locales.value.find(item => item.code === locale.value)?.language ?? locale.value
  }
}))

useSeoMeta({
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :toaster="{ expand: false }">
    <AppHeader />

    <UMain>
      <NuxtPage />
    </UMain>

    <AppFooter />

    <CookieBanner />
  </UApp>
</template>
