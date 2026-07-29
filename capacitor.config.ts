import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bitium.printgrid',
  appName: 'PrintGrid',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
