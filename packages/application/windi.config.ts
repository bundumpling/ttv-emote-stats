import { defineConfig } from 'windicss/helpers';

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
  plugins: [],
});