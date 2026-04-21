import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    host: true, // bind to 0.0.0.0 in production so Railway can route to us
    port: Number(process.env.PORT ?? 4321),
  },
});
