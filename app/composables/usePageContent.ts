/**
 * Landing content for the active locale.
 * Each locale is its own @nuxt/content collection (content/es, content/en).
 */
export function usePageContent() {
  const { locale } = useI18n()

  return useAsyncData(
    () => `landing-${locale.value}`,
    () => queryCollection(locale.value as 'es' | 'en').first(),
    { watch: [locale] }
  )
}
