<script setup lang="ts">
import { motion } from 'motion-v'
import type { VariantType } from 'motion-v'

const { t } = useI18n()
const nuxtApp = useNuxtApp()
const activeSection = ref<string>()

const { data: page } = await usePageContent()

const sectionIds = ['como-funciona', 'que-aporta', 'para-quien']

const items = computed(() => (page.value?.nav.links ?? []).map(link => ({
  ...link,
  exactHash: true,
  active: `#${activeSection.value}` === link.to
})))

nuxtApp.hooks.hookOnce('page:loading:end', () => {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.find(e => e.isIntersecting)
    if (visible) {
      activeSection.value = visible.target.id
    } else if (entries.every(e => !e.isIntersecting)) {
      activeSection.value = undefined
    }
  }, { rootMargin: '-50% 0px -50% 0px' })

  document.querySelectorAll(sectionIds.map(id => `#${id}`).join(', ')).forEach(el => observer.observe(el))
})

const variants: Record<string, VariantType | ((custom: unknown) => VariantType)> = {
  normal: {
    rotate: 0,
    y: 0,
    opacity: 1
  },
  close: (custom: unknown) => {
    const c = custom as number
    return {
      rotate: c === 1 ? 45 : c === 3 ? -45 : 0,
      y: c === 1 ? 6 : c === 3 ? -6 : 0,
      opacity: c === 2 ? 0 : 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  }
}
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLinkLocale
        to="/"
        class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
        aria-label="Vinculante.ai"
      >
        <AppLogo class="shrink-0" />
      </NuxtLinkLocale>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <LocaleSwitcher class="hidden lg:flex" />

      <UButton
        v-if="page?.nav"
        v-bind="page.nav.cta"
        color="primary"
        class="hidden lg:flex"
      />
    </template>

    <template #toggle="{ open, toggle, ui }">
      <UButton
        size="sm"
        variant="ghost"
        color="neutral"
        square
        :aria-label="open ? t('nav.close') : t('nav.open')"
        :aria-expanded="open"
        :class="ui.toggle({ toggleSide: 'right' })"
        @click="toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <motion.line
            x1="4"
            y1="6"
            x2="20"
            y2="6"
            :variants="variants"
            :animate="open ? 'close' : 'normal'"
            :custom="1"
            tabindex="-1"
          />
          <motion.line
            x1="4"
            y1="12"
            x2="20"
            y2="12"
            :variants="variants"
            :animate="open ? 'close' : 'normal'"
            :custom="2"
            tabindex="-1"
          />
          <motion.line
            x1="4"
            y1="18"
            x2="20"
            y2="18"
            :variants="variants"
            :animate="open ? 'close' : 'normal'"
            :custom="3"
            tabindex="-1"
          />
        </svg>
      </UButton>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />

      <div class="mt-4 flex flex-col gap-3">
        <UButton
          v-if="page?.nav"
          v-bind="page.nav.cta"
          color="primary"
          block
        />
        <LocaleSwitcher class="justify-center" />
      </div>
    </template>
  </UHeader>
</template>
