// @ts-check
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import sanity from '@sanity/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField, fontProviders } from 'astro/config'
import { SITE_URL } from './src/consts'

/**
 * Local font families. Every entry resolves to `./src/assets/fonts/<slug>.woff2` +
 * `.woff` and the CSS variable `--font-<slug>`, so the slug is the single source of
 * truth for both. woff2 is listed first because `src` is first-supported-wins.
 * @type {ReadonlyArray<{slug: string, name: string, weight: number, style?: 'normal' | 'italic'}>}
 */
const LOCAL_FONTS = [
  { slug: 'nuckle-thin', name: 'Nuckle Thin', weight: 100 },
  { slug: 'nuckle-semibold', name: 'Nuckle Semibold', weight: 600 },
  { slug: 'nuckle-regular', name: 'Nuckle Regular', weight: 400 },
  { slug: 'nuckle-medium', name: 'Nuckle Medium', weight: 500 },
  { slug: 'nuckle-light', name: 'Nuckle Light', weight: 300 },
  { slug: 'nuckle-hairline', name: 'Nuckle Hairline', weight: 100 },
  { slug: 'nuckle-extralight', name: 'Nuckle ExtraLight', weight: 200 },
  { slug: 'nuckle-bold', name: 'Nuckle Bold', weight: 900 },
  { slug: 'copernicus-italic', name: 'Copernicus Italic', weight: 400, style: 'italic' },
  { slug: 'copernicus-regular', name: 'Copernicus Regular', weight: 400 },
  { slug: 'copernicus-regular-2', name: 'Copernicus Regular 2', weight: 400 },
]

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  env: {
    schema: {
      PUBLIC_SANITY_STUDIO_PROJECT_ID: envField.string({
        context: 'client',
        access: 'public',
        default: 'hr4xqyhv',
      }),
      PUBLIC_SANITY_STUDIO_DATASET: envField.string({
        context: 'client',
        access: 'public',
        default: 'production',
      }),
      SANITY_STUDIO_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RESEND_AUDIENCE_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      ALTCHA_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
    validateSecrets: true,
  },
  integrations: [
    sitemap({
      lastmod: new Date(),
      filter: (page) =>
        page !== 'https://lymphaticspecialistsofmadison.com/subscribed/' &&
        page !== 'https://lymphaticspecialistsofmadison.com/unsubscribed/' &&
        page !== 'https://lymphaticspecialistsofmadison.com/privacy-policy/' &&
        page !== 'https://lymphaticspecialistsofmadison.com/terms-of-use/' &&
        page !== 'https://lymphaticspecialistsofmadison.com/cookie-policy/' &&
        page !== 'https://lymphaticspecialistsofmadison.com/404/',
    }),
    sanity({
      projectId: 'hr4xqyhv',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/admin',
      apiVersion: '2025-07-23',
    }),
    react(),
  ],
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    layout: 'constrained',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  adapter: netlify({
    imageCDN: false,
    cacheOnDemandPages: true,
  }),

  fonts: LOCAL_FONTS.map(({ slug, name, weight, style = 'normal' }) => ({
    provider: fontProviders.local(),
    name,
    cssVariable: `--font-${slug}`,
    options: {
      // annotated so `display` stays the literal 'swap' rather than widening to string,
      // and the array stays the non-empty tuple the Fonts API expects
      variants:
        /** @type {[{ src: [string, string]; weight: number; style: 'normal' | 'italic'; display: 'swap' }]} */ ([
          {
            src: /** @type {[string, string]} */ ([
              `./src/assets/fonts/${slug}.woff2`,
              `./src/assets/fonts/${slug}.woff`,
            ]),
            weight,
            style,
            display: 'swap',
          },
        ]),
    },
  })),
})
