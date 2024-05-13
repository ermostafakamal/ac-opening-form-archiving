import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'cbsenadocmap',
  exposes: {
    './Module': 'apps/remote/cbsenadocmap/src/app/remote-entry/entry.module.ts',
  },
};

export default config;
