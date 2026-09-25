<script setup lang="ts">
interface DemoVideo {
  src?: string
  poster?: string
  label: string
  placeholder: string
  play: string
  pause: string
  expand: string
  close: string
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
// The inline loop stays paused while the large version is open in the modal.
const expanded = ref(false)

// Self-hosted and muted instead of a YouTube embed: a silent loop needs no
// player, and it keeps third-party cookies off the page.
watch([visible, reducedMotion, expanded], ([isVisible, motion, isExpanded]) => {
  if (!el.value || pausedByUser.value) return
  if (isVisible && motion !== 'reduce' && !isExpanded) {
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

// Start the large video where the inline one was, so it feels like the same video growing.
// play() is called explicitly because `autoplay` alone is unreliable on a freshly mounted element.
function startExpanded(event: Event) {
  const expandedVideo = event.target as HTMLVideoElement
  if (el.value) expandedVideo.currentTime = el.value.currentTime
  expandedVideo.play().catch(() => {})
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
      <div class="absolute bottom-3 right-3 flex gap-2">
        <UButton
          icon="i-lucide-maximize-2"
          :aria-label="video.expand"
          color="neutral"
          variant="solid"
          size="sm"
          class="rounded-full opacity-80 hover:opacity-100"
          @click="expanded = true"
        />
        <!-- WCAG 2.2.2: moving content longer than 5 s needs a way to pause it. -->
        <UButton
          :icon="playing ? 'i-lucide-pause' : 'i-lucide-play'"
          :aria-label="playing ? video.pause : video.play"
          color="neutral"
          variant="solid"
          size="sm"
          class="rounded-full opacity-80 hover:opacity-100"
          @click="toggle"
        />
      </div>

      <UModal
        v-model:open="expanded"
        :title="video.label"
        :ui="{ content: 'sm:max-w-5xl', body: 'p-2 sm:p-2' }"
      >
        <!-- Own close button so its label comes from the content, not Nuxt UI's English default. -->
        <template #close="{ ui }">
          <UButton
            icon="i-lucide-x"
            :aria-label="video.close"
            color="neutral"
            variant="ghost"
            :class="ui.close()"
          />
        </template>
        <template #body>
          <!-- Opened on request, so it autoplays with native controls regardless of reduced motion. -->
          <video
            :src="video.src"
            :poster="video.poster"
            :aria-label="video.label"
            class="aspect-video w-full rounded-lg bg-muted"
            muted
            loop
            playsinline
            autoplay
            controls
            @loadedmetadata="startExpanded"
          />
        </template>
      </UModal>
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
