import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

import tailwind from '@astrojs/tailwind'

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
  ],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
})
