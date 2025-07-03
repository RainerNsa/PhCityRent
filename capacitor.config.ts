import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aaef8ece2e5c4edba0c068ad7257dc0f',
  appName: 'p-398841',
  webDir: 'dist',
  server: {
    url: 'https://aaef8ece-2e5c-4edb-a0c0-68ad7257dc0f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;