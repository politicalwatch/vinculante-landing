<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const { data: page } = await usePageContent()
const { reset: openCookieSettings } = useCookieConsent()
</script>

<template>
  <UFooter
    v-if="page?.footer"
    :ui="{
      container: 'border-t border-default lg:py-8',
      right: 'gap-x-0 flex-wrap'
    }"
  >
    <template #left>
      <p class="text-sm text-dimmed">
        {{ page.footer.tagline }} © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        v-for="link in page.footer.links"
        :key="link.label"
        v-bind="link"
        color="neutral"
        variant="link"
        class="font-light"
        size="sm"
      />
      <!-- Lets visitors withdraw or give consent after the first choice. -->
      <UButton
        v-if="config.public.gtagId"
        :label="t('cookies.settings')"
        color="neutral"
        variant="link"
        class="font-light"
        size="sm"
        @click="openCookieSettings"
      />
    </template>
  </UFooter>
</template>
