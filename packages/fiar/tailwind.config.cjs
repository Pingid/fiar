const config = require('@fiar/workbench/tailwind.config')
const path = require('path')

module.exports = {
  ...config,
  content: [
    ...config.content,
    path.join(__dirname, '../content/src/**/*.{ts,tsx}'),
    path.join(__dirname, '../assets/src/**/*.{ts,tsx}'),
    path.join(__dirname, '../auth/src/**/*.{ts,tsx}'),
  ],
}
