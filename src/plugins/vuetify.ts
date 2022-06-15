// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/lib/styles/main.sass'
// @ts-ignore
import colors from 'vuetify/lib/util/colors'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify(
  //   components,
  //   directives,
    {
        theme: {
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: colors.blue.darken1, // #1E88E5
                    }
                },
            }
        },
    }
)
