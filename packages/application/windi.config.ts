import { defineConfig } from 'windicss/helpers';
import { PluginFunction } from 'windicss/types/interfaces';

const smallCapsPlugin: PluginFunction = function ({ addComponents }) {
  const caps = {
    '.small-caps': {
      fontVariant: 'small-caps',
    }
  }

  addComponents(caps);
}

export default defineConfig({  
  extract: {
    include: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
    exclude: ['node_modules', '.git'],
  },
  theme: {
    extend: {
      fontFamily: {
        inconsolata: ["Inconsolata", "system-ui"]
      }
    }
  },
  plugins: [
    smallCapsPlugin
  ],
});