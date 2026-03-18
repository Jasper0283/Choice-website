// next.config.js
const repo = process.env.NEXT_PUBLIC_BASE_PATH || '';

module.exports = {
  output: 'export',              // nodig voor GitHub Pages
  basePath: repo ? `/${repo}` : '',
  assetPrefix: repo ? `/${repo}/` : '',
  images: { unoptimized: true }, // geen image-optimizer in static export
};