/* eslint-disable */
import path from 'node:path'

export default {
  test: {
    globals: true,
    coverage: {
      provider: 'v8', // uses @bcoe/v8-coverage behind the scenes
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
}
