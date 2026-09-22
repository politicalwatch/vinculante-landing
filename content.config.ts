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

const createCardListSchema = () => z.object({
  headline: z.string().optional(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  items: z.array(z.object({
    icon: z.string(),
    title: z.string().nonempty(),
    description: z.string().nonempty()
  }))
})

const pageSchema = z.object({
  nav: z.object({
    links: z.array(createLinkSchema()),
    cta: createLinkSchema()
  }),
  hero: z.object({
    headline: z.string().optional(),
    links: z.array(createLinkSchema())
  }),
  // Maqueta del hero: un fragmento de articulado y la aportación vinculada
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
      groupLabel: z.string().optional()
    }),
    explanationLabel: z.string().nonempty(),
    explanation: z.string().nonempty(),
    caption: z.string().optional()
  }),
  logos: z.object({
    title: z.string().nonempty(),
    items: z.array(z.object({
      label: z.string().nonempty(),
      to: z.string().optional(),
      // Ruta a un SVG en public/logos. Si falta, se muestra el label como texto.
      logo: z.string().optional()
    }))
  }),
  features: createCardListSchema(),
  steps: createCardListSchema(),
  audiences: createCardListSchema(),
  metrics: z.object({
    headline: z.string().optional(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    note: z.string().optional(),
    items: z.array(z.object({
      value: z.string().nonempty(),
      label: z.string().nonempty(),
      class: z.string().nonempty()
    }))
  }),
  cta: z.object({
    headline: z.string().optional(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    links: z.array(createLinkSchema()),
    newsletter: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      placeholder: z.string().nonempty(),
      submit: z.string().nonempty(),
      legal: z.string().nonempty()
    })
  }),
  footer: z.object({
    tagline: z.string().nonempty(),
    links: z.array(createLinkSchema())
  })
})

export const collections = {
  es: defineCollection({ source: 'es/index.yml', type: 'page', schema: pageSchema }),
  en: defineCollection({ source: 'en/index.yml', type: 'page', schema: pageSchema })
}
