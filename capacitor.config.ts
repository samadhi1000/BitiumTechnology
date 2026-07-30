import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bitium.app',
  appName: 'Bitium Technology',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
