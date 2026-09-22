<script setup lang="ts">
interface Linkage {
  documentLabel: string
  sectionNumber: string
  sectionTitle: string
  textBefore: string
  textHighlight: string
  textAfter: string
  connector: string
  degreeLabel: string
  proposal: {
    author: string
    authorType: string
    text: string
    groupLabel?: string
  }
  explanationLabel: string
  explanation: string
  caption?: string
}

const { linkage } = defineProps<{
  linkage: Linkage
}>()

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay }
  }
}
</script>

<template>
  <figure class="flex flex-col gap-3">
    <!-- Provision of the legal text -->
    <Motion
      as-child
      v-bind="reveal(1)"
    >
      <div class="rounded-xl border border-default bg-elevated/80 p-5 backdrop-blur-sm sm:p-6">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em] text-dimmed">
          {{ linkage.documentLabel }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-highlighted">
          {{ linkage.sectionNumber }}. {{ linkage.sectionTitle }}
        </h3>
        <p class="mt-3 text-sm leading-relaxed text-toned">
          {{ linkage.textBefore }}<mark
            class="rounded-sm bg-primary/15 px-0.5 text-highlighted decoration-primary/60 underline-offset-4"
          >{{ linkage.textHighlight }}</mark>{{ linkage.textAfter }}
        </p>
      </div>
    </Motion>

    <!-- Connector -->
    <Motion
      as-child
      v-bind="reveal(1.35)"
    >
      <div class="flex items-center justify-center gap-2 text-dimmed">
        <UIcon
          name="i-lucide-arrow-down"
          class="size-4"
        />
        <span class="font-mono text-[11px] uppercase tracking-[0.12em]">
          {{ linkage.connector }}
        </span>
        <UBadge
          :label="linkage.degreeLabel"
          color="primary"
          variant="soft"
          size="sm"
          class="rounded-full"
        />
      </div>
    </Motion>

    <!-- Linked contribution -->
    <Motion
      as-child
      v-bind="reveal(1.6)"
    >
      <div class="rounded-xl border border-default bg-elevated/80 p-5 backdrop-blur-sm sm:p-6">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="text-sm font-semibold text-highlighted">{{ linkage.proposal.author }}</span>
          <span class="text-dimmed">·</span>
          <span class="text-sm text-muted">{{ linkage.proposal.authorType }}</span>
        </div>

        <blockquote class="mt-3 border-s-2 border-primary/40 ps-4 font-serif text-[15px] leading-relaxed text-toned">
          {{ linkage.proposal.text }}
        </blockquote>

        <p
          v-if="linkage.proposal.groupLabel"
          class="mt-3 flex items-center gap-1.5 text-xs text-dimmed"
        >
          <UIcon
            name="i-lucide-users"
            class="size-3.5 shrink-0"
          />
          {{ linkage.proposal.groupLabel }}
        </p>

        <div class="mt-4 border-t border-muted pt-4">
          <p class="font-mono text-[11px] uppercase tracking-[0.12em] text-dimmed">
            {{ linkage.explanationLabel }}
          </p>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            {{ linkage.explanation }}
          </p>
        </div>
      </div>
    </Motion>

    <figcaption
      v-if="linkage.caption"
      class="text-center text-xs text-dimmed"
    >
      {{ linkage.caption }}
    </figcaption>
  </figure>
</template>
