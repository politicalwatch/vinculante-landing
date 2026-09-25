import { defineCollection, z } from '@nuxt/content'

const createEnum = (options: [string, ...string[]]) => z.enum(options)

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  trailingIcon: z.string().optional().editor({ input: 'icon' }),
  size: createEnum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  trailing: z.boolean().optional(),
  target: createEnum(['_blank', '_self']).optional(),
  color: createEnum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info']).optional(),
  variant: createEnum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional()
})

// Every section is all or nothing: either it is missing from the YAML entirely and
// the page skips it, or it is present and complete. Only extras are optional here.
const createCardListSchema = () => z.object({
  headline: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  items: z.array(z.object({
    icon: z.string().nonempty(),
    title: z.string().nonempty(),
    description: z.string().nonempty()
  })).min(1)
})

const pageSchema = z.object({
  nav: z.object({
    links: z.array(createLinkSchema()).min(1)
  }),
  hero: z.object({
    headline: z.string().nonempty(),
    links: z.array(createLinkSchema()).min(1)
  }),
  // Mockup under the steps and video: an excerpt of the legal text and the contribution linked to it
  linkage: z.object({
    documentLabel: z.string().nonempty(),
    sectionNumber: z.string().nonempty(),
    sectionTitle: z.string().nonempty(),
    textBefore: z.string(),
    textHighlight: z.string().nonempty(),
    textAfter: z.string(),
    connector: z.string().nonempty(),
    degreeLabel: z.string().nonempty(),
    proposal: z.object({
      author: z.string().nonempty(),
      authorType: z.string().nonempty(),
      text: z.string().nonempty(),
      // Only shown when several organisations submitted the same proposal.
      groupLabel: z.string().optional()
    }),
    explanationLabel: z.string().nonempty(),
    explanation: z.string().nonempty(),
    caption: z.string().optional()
  }).optional(),
  logos: z.object({
    title: z.string().nonempty(),
    items: z.array(z.object({
      label: z.string().nonempty(),
      to: z.string().nonempty(),
      // Path to an SVG in public/logos. Falls back to the label as text.
      logo: z.string().optional()
    })).min(1)
  }).optional(),
  features: createCardListSchema().optional(),
  steps: createCardListSchema().extend({
    // Silent product demo shown next to the steps. Without `src` a placeholder is rendered.
    video: z.object({
      src: z.string().optional(),
      poster: z.string().optional(),
      // Describes what the video shows: it has no voiceover, so this is its text alternative.
      label: z.string().nonempty(),
      placeholder: z.string().nonempty(),
      play: z.string().nonempty(),
      pause: z.string().nonempty(),
      expand: z.string().nonempty(),
      close: z.string().nonempty()
    }).optional()
  }).optional(),
  audiences: createCardListSchema().optional(),
  metrics: z.object({
    headline: z.string().nonempty(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    // Footnote under the figures, e.g. to flag provisional data.
    note: z.string().optional(),
    items: z.array(z.object({
      value: z.string().nonempty(),
      label: z.string().nonempty(),
      class: z.string().nonempty()
    })).min(2).max(6),
    // Shown under the description, above the figures, e.g. a link to the live demo.
    links: z.array(createLinkSchema()).min(1).optional()
  }).optional(),
  cta: z.object({
    headline: z.string().nonempty(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    links: z.array(createLinkSchema()).min(1),
    newsletter: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      placeholder: z.string().nonempty(),
      submit: z.string().nonempty(),
      success: z.string().nonempty(),
      subscribed: z.string().nonempty(),
      error: z.string().nonempty(),
      consent: z.string().nonempty(),
      legal: z.string().nonempty(),
      privacy: z.object({
        label: z.string().nonempty(),
        to: z.string().url()
      })
    })
  }).optional(),
  // Public funding notice required by the Red.es agreement: text with an inline link, then the institutional logos.
  funding: z.object({
    textBefore: z.string(),
    link: z.object({
      label: z.string().nonempty(),
      to: z.string().url()
    }),
    textAfter: z.string(),
    logos: z.array(z.object({
      label: z.string().nonempty(),
      // Path to an image in public/logos/funding.
      src: z.string().nonempty(),
      width: z.number().int().positive(),
      height: z.number().int().positive()
    })).min(1)
  }).optional(),
  footer: z.object({
    tagline: z.string().nonempty(),
    links: z.array(createLinkSchema()).min(1)
  }).optional()
})

export const collections = {
  es: defineCollection({ source: 'es/index.yml', type: 'page', schema: pageSchema }),
  en: defineCollection({ source: 'en/index.yml', type: 'page', schema: pageSchema })
}
