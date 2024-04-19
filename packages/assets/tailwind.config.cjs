const config = require('@fiar/workbench/tailwind.config')
const path = require('path')

module.exports = {
  ...config,
  content: [...config.content, path.join(__dirname, './src/**/*.{ts,tsx}')],
}
