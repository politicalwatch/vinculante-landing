<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { locale } = useI18n()
const { data: page } = await usePageContent()

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = computed(() => page.value?.seo?.title || page.value?.title)
const description = computed(() => page.value?.seo?.description || page.value?.description)

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogLocale: () => (locale.value === 'es' ? 'es_ES' : 'en_GB')
})

const heroTitle = computed(() => {
  const [primary = '', ...secondaryParts] = (page.value?.title ?? '').split('\n')

  return {
    primary,
    secondary: secondaryParts.join(' ').trim()
  }
})

function enterMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay }
  }
}

function scrollMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    inViewOptions: { once: true, amount: 1 },
    transition: { duration: 0.6, delay }
  }
}

function staggerMotion(index: number = 0) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    inViewOptions: { once: true, amount: 1 },
    transition: { duration: 0.6, delay: index * 0.08 }
  }
}

const sectionUi = {
  root: 'py-24 sm:py-32 scroll-mt-(--ui-header-height)',
  container: 'max-w-5xl',
  headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
  title: 'max-w-xl mx-auto',
  description: 'max-w-md mx-auto text-dimmed'
}
</script>

<template>
  <div v-if="page">
    <!-- Hero -->
    <UPageHero
      :ui="{
        root: 'pb-24 sm:pb-32',
        container: 'relative z-10 lg:py-32',
        wrapper: 'flex flex-col items-center',
        title: 'sm:text-6xl lg:text-7xl xl:text-[76px] tracking-tight leading-[1.05]',
        description: 'mt-5 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-default',
        links: 'gap-3'
      }"
    >
      <template #top>
        <Motion v-bind="staggerMotion(0)">
          <HeroShaders class="absolute top-0 inset-x-0 opacity-20 h-full" />
        </Motion>

        <GradientGlow class="top-0 w-2/3 h-1/2" />
      </template>

      <template #headline>
        <Motion v-bind="enterMotion(0.2)">
          <UBadge
            color="neutral"
            variant="soft"
            :label="page.hero.headline"
            class="rounded-full px-3 py-1.5 gap-1.5 bg-elevated/70 backdrop-blur-sm"
          >
            <template #leading>
              <UChip
                inset
                standalone
                :ui="{ base: 'animate-pulse ring-0' }"
              />
            </template>
          </UBadge>
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="enterMotion(0.35)"
          class="inline-block"
        >
          {{ heroTitle.primary }}
          <br v-if="heroTitle.secondary">
          <span
            v-if="heroTitle.secondary"
            class="text-primary-600"
          >
            {{ heroTitle.secondary }}
          </span>
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="enterMotion(0.5)"
          class="inline-block"
        >
          {{ page.description }}
        </Motion>
      </template>

      <template #links>
        <Motion
          class="flex flex-wrap justify-center gap-6"
          v-bind="enterMotion(0.65)"
        >
          <UButton
            v-for="link in page.hero.links"
            :key="link.label"
            v-bind="link"
          />
        </Motion>
      </template>

      <Motion
        v-if="page.logos"
        class="flex flex-col items-center gap-3"
        v-bind="enterMotion(0.8)"
      >
        <p class="font-mono uppercase text-xs tracking-[0.12em] text-dimmed">
          {{ page.logos.title }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <ULink
            v-for="item in page.logos.items"
            :key="item.label"
            :to="item.to"
            target="_blank"
            :aria-label="item.label"
            class="opacity-80 transition-opacity hover:opacity-100"
          >
            <img
              v-if="item.logo"
              :src="item.logo"
              :alt="item.label"
              class="h-5 w-auto"
            >
            <span
              v-else
              class="font-serif text-lg text-muted"
            >{{ item.label }}</span>
          </ULink>
        </div>
      </Motion>

      <div
        v-if="page.linkage"
        class="max-w-2xl mx-auto w-full"
      >
        <HeroLinkage :linkage="page.linkage" />
      </div>
    </UPageHero>

    <!-- How it works -->
    <UPageSection
      v-if="page.steps"
      id="como-funciona"
      :ui="sectionUi"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.steps.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.steps.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.steps.description }}
        </Motion>
      </template>

      <div
        class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-default bg-default sm:grid-cols-2 lg:grid-cols-4"
      >
        <Motion
          v-for="(step, index) in page.steps.items"
          :key="step.title"
          v-bind="staggerMotion(index)"
        >
          <UPageCard
            :icon="step.icon"
            :title="step.title"
            :description="step.description"
            class="h-full rounded-none duration-300"
            :ui="{
              leading: 'mb-5 flex size-9 justify-center rounded-lg bg-primary/10',
              title: 'text-sm tracking-tight',
              description: 'text-sm leading-relaxed text-dimmed'
            }"
          />
        </Motion>
      </div>
    </UPageSection>

    <!-- What it does -->
    <UPageSection
      v-if="page.features"
      id="que-aporta"
      :ui="sectionUi"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.features.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.features.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.features.description }}
        </Motion>
      </template>

      <div
        class="rounded-2xl border border-default bg-default overflow-hidden"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
          <Motion
            v-for="(feature, index) in page.features.items"
            :key="feature.title"
            v-bind="staggerMotion(index)"
          >
            <UPageCard
              :icon="feature.icon"
              :title="feature.title"
              :description="feature.description"
              class="h-full rounded-none duration-300"
              :ui="{
                leading: 'mb-5 flex size-9 justify-center rounded-lg bg-primary/10',
                title: 'text-sm tracking-tight',
                description: 'text-sm leading-relaxed text-dimmed'
              }"
            />
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- Who it is for -->
    <UPageSection
      v-if="page.audiences"
      id="para-quien"
      :ui="sectionUi"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.audiences.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.audiences.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.audiences.description }}
        </Motion>
      </template>

      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Motion
          v-for="(audience, index) in page.audiences.items"
          :key="audience.title"
          v-bind="staggerMotion(index)"
        >
          <UPageCard
            :icon="audience.icon"
            :title="audience.title"
            :description="audience.description"
            variant="subtle"
            class="h-full duration-300"
            :ui="{
              leading: 'mb-4 flex size-9 justify-center rounded-lg bg-primary/10',
              title: 'text-base tracking-tight',
              description: 'text-sm leading-relaxed text-dimmed'
            }"
          />
        </Motion>
      </div>
    </UPageSection>

    <!-- Pilot metrics -->
    <UPageSection
      v-if="page.metrics"
      id="piloto"
      :ui="sectionUi"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.metrics.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.metrics.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.metrics.description }}
        </Motion>
      </template>

      <div
        class="rounded-2xl border border-default bg-default overflow-hidden"
      >
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px">
          <Motion
            v-for="(metric, index) in page.metrics.items"
            :key="metric.label"
            v-bind="staggerMotion(index)"
          >
            <UPageCard
              :title="metric.value"
              :description="metric.label"
              class="h-full rounded-none duration-300"
              :ui="{
                root: 'text-center',
                wrapper: 'items-center',
                title: ['text-4xl font-bold tracking-tight leading-none', metric.class],
                description: 'font-mono text-xs uppercase tracking-[0.06em] text-dimmed mt-3'
              }"
            />
          </Motion>
        </div>
      </div>

      <p
        v-if="page.metrics.note"
        class="mt-4 text-center text-xs text-dimmed"
      >
        {{ page.metrics.note }}
      </p>
    </UPageSection>

    <!-- Contact -->
    <UPageCTA
      v-if="page.cta"
      id="contacto"
      variant="naked"
      :ui="{
        root: 'py-24 sm:py-32 scroll-mt-(--ui-header-height)',
        container: 'max-w-3xl text-center',
        title: 'lg:text-5xl tracking-tight whitespace-pre-line',
        description: 'mx-auto max-w-lg leading-relaxed text-dimmed'
      }"
    >
      <template #top>
        <GradientGlow class="bottom-0 w-2/3 h-1/2" />
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.cta.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.cta.description }}
        </Motion>
      </template>

      <template #links>
        <Motion
          class="flex flex-col items-center justify-center gap-8"
          v-bind="scrollMotion(0.2)"
        >
          <UButton
            v-for="link in page.cta.links"
            :key="link.label"
            v-bind="link"
            size="xl"
          />

          <NewsletterForm :newsletter="page.cta.newsletter" />
        </Motion>
      </template>
    </UPageCTA>
  </div>
</template>
