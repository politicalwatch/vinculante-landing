<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const items = computed(() => locales.value.map(item => ({
  label: item.name ?? item.code,
  to: switchLocalePath(item.code),
  active: item.code === locale.value
})))
</script>

<template>
  <div class="flex items-center gap-1">
    <UButton
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :label="item.label"
      :locale="false"
      color="neutral"
      :variant="item.active ? 'soft' : 'ghost'"
      size="xs"
      class="font-medium"
    />
  </div>
</template>
