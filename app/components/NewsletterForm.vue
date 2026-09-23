<script setup lang="ts">
interface Newsletter {
  title: string
  description: string
  placeholder: string
  submit: string
  success: string
  subscribed: string
  error: string
  consent: string
  legal: string
  privacy: {
    label: string
    to: string
  }
}

const { newsletter } = defineProps<{
  newsletter: Newsletter
}>()

const config = useRuntimeConfig()

// Mailchimp classic embed. list-manage.com has no CORS, so it is called via
// JSONP on `/subscribe/post-json`: the native POST redirects to a hosted
// confirmation page that renders blank for this account. `action` stays as
// the no-JS fallback.
const action = computed(() => config.public.mailchimpUrl as string)
const honeypot = computed(() => config.public.mailchimpHoneypot as string)
// The audience has GDPR fields on: without this permission Mailchimp stores the
// contact but GDPR-safe campaigns skip it.
const gdprId = computed(() => config.public.mailchimpGdprId as string)

type Status = 'idle' | 'loading' | 'success' | 'subscribed' | 'error'
const status = ref<Status>('idle')

interface MailchimpResponse {
  result: 'success' | 'error'
  msg: string
}

function jsonp(url: string): Promise<MailchimpResponse> {
  return new Promise((resolve, reject) => {
    const callback = `mc_${Date.now()}`
    const script = document.createElement('script')
    const w = window as unknown as Record<string, unknown>
    const cleanup = () => {
      clearTimeout(timer)
      Reflect.deleteProperty(w, callback)
      script.remove()
    }
    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('timeout'))
    }, 10000)

    w[callback] = (data: MailchimpResponse) => {
      cleanup()
      resolve(data)
    }
    script.onerror = () => {
      cleanup()
      reject(new Error('network'))
    }
    script.src = `${url}&c=${callback}`
    document.head.appendChild(script)
  })
}

async function onSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  const data = new URLSearchParams()
  new FormData(form).forEach((value, key) => data.append(key, value as string))

  status.value = 'loading'
  try {
    const url = action.value.replace('/subscribe/post?', '/subscribe/post-json?')
    const res = await jsonp(`${url}&${data}`)
    // Mailchimp only returns English free text, and reports an existing
    // subscriber as `success` ("You're already subscribed, your profile has
    // been updated"), so the message is the only way to tell them apart.
    if (/already subscribed/i.test(res.msg)) {
      status.value = 'subscribed'
    } else {
      status.value = res.result === 'success' ? 'success' : 'error'
    }
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div class="w-full max-w-md rounded-xl border border-default bg-elevated/60 p-6 text-left backdrop-blur-sm">
    <p class="text-sm font-semibold text-highlighted">
      {{ newsletter.title }}
    </p>
    <p class="mt-1 text-sm leading-relaxed text-muted">
      {{ newsletter.description }}
    </p>

    <p
      v-if="status === 'success' || status === 'subscribed'"
      role="status"
      class="mt-4 flex items-start gap-2 text-sm text-highlighted"
    >
      <UIcon
        name="i-lucide-mail-check"
        class="mt-0.5 size-4 shrink-0 text-primary"
      />
      {{ status === 'success' ? newsletter.success : newsletter.subscribed }}
    </p>

    <form
      v-else
      :action="action"
      method="post"
      target="_blank"
      class="mt-4 flex flex-col gap-3"
      @submit.prevent="onSubmit"
    >
      <div class="flex flex-col gap-2 sm:flex-row">
        <label
          class="sr-only"
          for="newsletter-email"
        >{{ newsletter.placeholder }}</label>
        <UInput
          id="newsletter-email"
          name="EMAIL"
          type="email"
          required
          autocomplete="email"
          :placeholder="newsletter.placeholder"
          size="lg"
          class="flex-1"
        />

        <!-- Antispam honeypot required by Mailchimp: hidden, do not touch. -->
        <div
          aria-hidden="true"
          style="position: absolute; left: -5000px;"
        >
          <input
            :name="honeypot"
            type="text"
            tabindex="-1"
            value=""
          >
        </div>

        <UButton
          type="submit"
          :label="newsletter.submit"
          color="primary"
          size="lg"
          :loading="status === 'loading'"
          :disabled="!action"
        />
      </div>

      <!-- Native checkbox so the value is posted with the form. -->
      <label
        v-if="gdprId"
        class="flex items-start gap-2 text-sm text-muted"
      >
        <input
          :name="`gdpr[${gdprId}]`"
          type="checkbox"
          value="Y"
          required
          class="mt-0.5 size-4 shrink-0 accent-(--ui-primary)"
        >
        <span>{{ newsletter.consent }}</span>
      </label>

      <p
        v-if="status === 'error'"
        role="alert"
        class="text-sm text-error"
      >
        {{ newsletter.error }}
      </p>
    </form>

    <p class="mt-3 text-xs leading-relaxed text-dimmed">
      {{ newsletter.legal }}
      <ULink
        :to="newsletter.privacy.to"
        target="_blank"
        class="underline"
      >{{ newsletter.privacy.label }}</ULink>.
    </p>
  </div>
</template>
