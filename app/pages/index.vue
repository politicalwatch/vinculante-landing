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
  // The container already pads each section; padding the root as well doubled the gap
  root: 'scroll-mt-(--ui-header-height)',
  container: 'max-w-5xl py-12 sm:py-16 lg:py-20',
  headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
  title: 'max-w-xl mx-auto',
  description: 'max-w-md mx-auto text-dimmed'
}

// Horizontal sections (text beside media) align left instead of centring.
const horizontalSectionUi = {
  ...sectionUi,
  headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em]',
  title: '',
  description: 'text-dimmed'
}

// Metric cells grow to fill each row, so an odd count never leaves an empty cell.
// Desktop: one row for up to 4 metrics, rows of 3 for 5 or 6. Tablet: rows of 2.
const metricBasis: Record<number, string> = {
  2: 'lg:basis-[calc(50%-1px)]',
  3: 'lg:basis-[calc(33.333%-1px)]',
  4: 'lg:basis-[calc(25%-1px)]'
}
const metricItemClass = computed(() => [
  'grow basis-full sm:basis-[calc(50%-1px)]',
  metricBasis[page.value?.metrics?.items.length ?? 0] ?? 'lg:basis-[calc(33.333%-1px)]'
])
</script>

<template>
  <div v-if="page">
    <!-- Hero -->
    <UPageHero
      :ui="{
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
    <!-- Steps beside the demo video: the list narrates what the silent video shows. -->
    <UPageSection
      v-if="page.steps"
      id="como-funciona"
      orientation="horizontal"
      :ui="horizontalSectionUi"
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

      <!-- #body instead of #features: the timeline is not a <ul> of UPageFeature. -->
      <template #body>
        <Motion v-bind="scrollMotion(0.3)">
          <!-- Title is as tall as the lg indicator (size-9) and the theme's mt-2 is removed, so the first line centres on the stop. -->
          <UTimeline
            :items="page.steps.items"
            size="lg"
            :ui="{
              indicator: 'rounded-lg bg-primary/10 text-primary',
              separator: 'bg-primary/20',
              wrapper: 'mt-0 pb-8 group-last:pb-0',
              title: 'flex min-h-9 items-center text-sm tracking-tight',
              description: 'mt-1 text-sm leading-relaxed text-dimmed'
            }"
          />
        </Motion>
      </template>

      <Motion
        v-if="page.steps.video"
        v-bind="scrollMotion(0.2)"
      >
        <DemoVideo :video="page.steps.video" />
      </Motion>
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
              variant="subtle"
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

      <template
        v-if="page.metrics.links"
        #links
      >
        <Motion
          class="flex flex-wrap justify-center gap-x-6 gap-y-3"
          v-bind="scrollMotion(0.3)"
        >
          <UButton
            v-for="link in page.metrics.links"
            :key="link.label"
            v-bind="link"
          />
        </Motion>
      </template>

      <!-- Wrapped so the section's gap does not separate the note from the grid -->
      <div>
        <div
          class="rounded-2xl border border-default bg-default overflow-hidden"
        >
          <div class="flex flex-wrap gap-px">
            <Motion
              v-for="(metric, index) in page.metrics.items"
              :key="metric.label"
              v-bind="staggerMotion(index)"
              :class="metricItemClass"
            >
              <UPageCard
                :title="metric.value"
                :description="metric.label"
                variant="subtle"
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
      </div>
    </UPageSection>

    <!-- Contact -->
    <UPageCTA
      v-if="page.cta"
      id="contacto"
      variant="naked"
      orientation="horizontal"
      :ui="{
        root: 'scroll-mt-(--ui-header-height)',
        // Centered single column on mobile; text left and newsletter right from lg
        container: 'max-w-5xl lg:gap-16',
        wrapper: 'text-center lg:text-start',
        title: 'lg:text-5xl tracking-tight whitespace-pre-line',
        description: 'mx-auto lg:mx-0 max-w-lg leading-relaxed text-dimmed',
        links: 'justify-center lg:justify-start'
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
          class="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3"
          v-bind="scrollMotion(0.2)"
        >
          <UButton
            v-for="link in page.cta.links"
            :key="link.label"
            v-bind="link"
            size="xl"
          />
        </Motion>
      </template>

      <Motion
        class="flex justify-center lg:justify-end"
        v-bind="scrollMotion(0.3)"
      >
        <NewsletterForm :newsletter="page.cta.newsletter" />
      </Motion>
    </UPageCTA>
  </div>
</template>
