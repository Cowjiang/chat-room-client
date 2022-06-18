// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/lib/styles/main.sass'
// @ts-ignore
import colors from 'vuetify/lib/util/colors'
import { createVuetify } from 'vuetify'

export default createVuetify(
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
