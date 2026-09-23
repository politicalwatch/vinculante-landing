<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const { consent, ready, load, accept, reject } = useCookieConsent()

const gtagId = config.public.gtagId as string

// gtag.js is not requested until the visitor accepts, so no Google cookie is
// set before consent (politicalwatch.es gets the same with nuxt-gtag's manual init).
if (gtagId) {
  const { proxy } = useScriptGoogleAnalytics({
    id: gtagId,
    // Only analytics is used: advertising signals stay denied even after accepting.
    defaultConsent: {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    },
    scriptOptions: {
      trigger: useScriptTriggerConsent({ consent: computed(() => consent.value === true) })
    }
  })

  // Withdrawing consent after gtag.js has loaded: tell it to stop storing.
  watch(consent, (value, previous) => {
    if (previous === true && value !== true) {
      proxy.gtag('consent', 'update', { analytics_storage: 'denied' })
    }
  })
}

onMounted(load)
</script>

<template>
  <section
    v-if="gtagId && ready && consent === null"
    :aria-label="t('cookies.label')"
    class="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-default bg-default/95 p-4 shadow-lg backdrop-blur-sm sm:p-5"
  >
    <p class="text-sm leading-relaxed text-muted">
      {{ t('cookies.message') }}
      <ULink
        :to="t('cookies.policyUrl')"
        target="_blank"
        class="underline"
      >{{ t('cookies.policy') }}</ULink>.
    </p>

    <!-- Same weight for both choices: rejecting must be as easy as accepting. -->
    <div class="mt-4 flex flex-wrap gap-2">
      <UButton
        :label="t('cookies.accept')"
        color="primary"
        @click="accept"
      />
      <UButton
        :label="t('cookies.reject')"
        color="primary"
        variant="outline"
        @click="reject"
      />
    </div>
  </section>
</template>
