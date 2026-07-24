import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'expressiveLight',
    themes: {
      expressiveLight: {
        dark: false,
        colors: {
          primary: '#6750A4', // MD3 Expressive Purple
          'on-primary': '#FFFFFF',
          primaryContainer: '#EADDFF',
          'on-primary-container': '#21005D',
          secondary: '#625B71',
          'on-secondary': '#FFFFFF',
          secondaryContainer: '#E8DEF8',
          'on-secondary-container': '#1D192B',
          tertiary: '#7D5260',
          'on-tertiary': '#FFFFFF',
          tertiaryContainer: '#FFD8E4',
          'on-tertiary-container': '#31111D',
          background: '#FEF7FF',
          surface: '#FEF7FF',
          'surface-variant': '#E7E0EC',
          'on-surface-variant': '#49454F',
          outline: '#79747E',
          error: '#B3261E',
          success: '#2E7D32',
          warning: '#ED6C02',
          info: '#0288D1'
        }
      }
    }
  },
  defaults: {
    VCard: {
      elevation: 0,
      rounded: 'xl'
    },
    VBtn: {
      rounded: 'pill',
      height: 48,
      elevation: 1
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg'
    }
  }
});
