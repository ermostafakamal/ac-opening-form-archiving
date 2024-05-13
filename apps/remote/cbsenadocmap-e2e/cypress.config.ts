import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run cbsenadocmap:serve:development',
        production: 'nx run cbsenadocmap:serve:production',
      },
      ciWebServerCommand: 'nx run cbsenadocmap:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
