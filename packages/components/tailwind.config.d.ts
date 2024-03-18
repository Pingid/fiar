import typography from '@tailwindcss/typography'

declare const _default: {
  content: string[]
  darkMode: ['class', string]
  theme: {
    extend: {
      fontFamily: {
        sans: string
      }
      borderRadius: {
        DEFAULT: string
      }
      borderColor: {
        DEFAULT: string
      }
      rotate: {
        '270': string
      }
      colors: {
        back: {
          DEFAULT: string
        }
        frame: {
          DEFAULT: string
        }
        front: {
          DEFAULT: string
        }
        line: {
          DEFAULT: string
          focus: string
        }
        active: {
          DEFAULT: string
        }
        error: {
          DEFAULT: string
        }
        draft: {
          DEFAULT: string
        }
        published: {
          DEFAULT: string
        }
        archived: {
          DEFAULT: string
        }
      }
      typography: (theme: any) => {
        DEFAULT: {
          css: {
            color: any
            '--tw-prose-bold': any
            '--tw-prose-body': any
            '--tw-prose-links': any
            '--tw-prose-headings': any
            a: {
              color: any
              '&:hover': {
                color: any
              }
            }
          }
        }
      }
    }
  }
  plugins: (
    | typeof typography
    | {
        handler: (x: import('tailwindcss/types/config.js').PluginAPI) => void
      }
  )[]
}

export default _default
