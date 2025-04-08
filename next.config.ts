/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.scdn.co', // Spotify album arts
      'mosaic.scdn.co', // Spotify album arts (mosaic)
      'seeded-session-images.scdn.co', // Spotify session images
      'lineup-images.scdn.co', // Spotify lineup images
      'image-cdn-fa.spotifycdn.com' // Another Spotify image CDN
    ],
  },
}

module.exports = nextConfig