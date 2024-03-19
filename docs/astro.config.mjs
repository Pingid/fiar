import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Fiar',
      social: { github: 'https://github.com/Pingid/fiar' },
      customCss: ['./src/index.css'],
      sidebar: [
        { label: 'Guides', autogenerate: { directory: 'guides' } },
        { label: 'Reference', autogenerate: { directory: 'reference' } },
      ],
      components: {},
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
})
