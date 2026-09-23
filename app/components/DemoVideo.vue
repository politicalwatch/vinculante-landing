<script setup lang="ts">
interface DemoVideo {
  src?: string
  poster?: string
  label: string
  placeholder: string
  play: string
  pause: string
}

const { video } = defineProps<{
  video: DemoVideo
}>()

const el = useTemplateRef<HTMLVideoElement>('el')
const visible = useElementVisibility(el)
const reducedMotion = usePreferredReducedMotion()
const playing = ref(false)
// Once the visitor pauses, scrolling back into view must not restart it.
const pausedByUser = ref(false)

// Self-hosted and muted instead of a YouTube embed: a silent loop needs no
// player, and it keeps third-party cookies off the page.
watch([visible, reducedMotion], ([isVisible, motion]) => {
  if (!el.value || pausedByUser.value) return
  if (isVisible && motion !== 'reduce') {
    el.value.play().catch(() => {})
  } else {
    el.value.pause()
  }
})

function toggle() {
  if (!el.value) return
  if (el.value.paused) {
    pausedByUser.value = false
    el.value.play().catch(() => {})
  } else {
    pausedByUser.value = true
    el.value.pause()
  }
}
</script>

<template>
  <UPageCard
    variant="subtle"
    class="rounded-2xl"
    :ui="{ container: 'p-2 sm:p-2' }"
  >
    <div
      v-if="video.src"
      class="relative"
    >
      <video
        ref="el"
        :src="video.src"
        :poster="video.poster"
        :aria-label="video.label"
        class="aspect-video w-full rounded-xl bg-muted object-cover"
        muted
        loop
        playsinline
        preload="metadata"
        @play="playing = true"
        @pause="playing = false"
      />
      <!-- WCAG 2.2.2: moving content longer than 5 s needs a way to pause it. -->
      <UButton
        :icon="playing ? 'i-lucide-pause' : 'i-lucide-play'"
        :aria-label="playing ? video.pause : video.play"
        color="neutral"
        variant="solid"
        size="sm"
        class="absolute bottom-3 right-3 rounded-full opacity-80 hover:opacity-100"
        @click="toggle"
      />
    </div>

    <!-- Placeholder until the demo is recorded (same pattern as the Nuxt UI SaaS template). -->
    <div
      v-else
      class="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-dashed border-accented"
    >
      <svg
        class="absolute inset-0 size-full stroke-inverted/10"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="demo-video-placeholder"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
          </pattern>
        </defs>
        <rect
          stroke="none"
          fill="url(#demo-video-placeholder)"
          width="100%"
          height="100%"
        />
      </svg>
      <p class="relative flex items-center gap-2 rounded-full bg-default px-3 py-1.5 text-sm text-muted ring ring-default">
        <UIcon
          name="i-lucide-clapperboard"
          class="size-4 text-primary"
        />
        {{ video.placeholder }}
      </p>
    </div>
  </UPageCard>
</template>
