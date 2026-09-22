/**
 * Contenido de la landing para el idioma activo.
 * Cada idioma es una colección de @nuxt/content (content/es, content/en).
 */
export function usePageContent() {
  const { locale } = useI18n()

  return useAsyncData(
    () => `landing-${locale.value}`,
    () => queryCollection(locale.value as 'es' | 'en').first(),
    { watch: [locale] }
  )
}
