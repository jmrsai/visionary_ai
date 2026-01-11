import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  const iconUrl = "https://firebasestorage.googleapis.com/v0/b/studio-4426725626-6840a.firebasestorage.app/o/Icon.png?alt=media&token=76082f00-62a6-4d64-8202-9c462ab06c91";
  
  return {
    name: 'Visionary - Your Personal Vision Care App',
    short_name: 'Visionary',
    description: 'An application for eye health, exercises, and therapies.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait-primary',
    icons: [
      {
        src: iconUrl,
        sizes: '72x72',
        type: 'image/png'
      },
      {
        src: iconUrl,
        sizes: '96x96',
        type: 'image/png'
      },
      {
        src: iconUrl,
        sizes: '128x128',
        type: 'image/png'
      },
      {
        src: iconUrl,
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: iconUrl,
        sizes: '152x152',
        type: 'image/png'
      },
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: iconUrl,
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
}
