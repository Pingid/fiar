const config = require('@fiar/components/tailwind.config')

module.exports = {
  ...config,
  content: [
    '../components/src/**/*.{ts,tsx}',
    '../workbench/src/**/*.{ts,tsx}',
    '../content/src/**/*.{ts,tsx}',
    '../assets/src/**/*.{ts,tsx}',
    '../auth/src/**/*.{ts,tsx}',
  ],
}
