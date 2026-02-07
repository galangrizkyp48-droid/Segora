import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.segora.marketplace',
    appName: 'Segora',
    webDir: 'public',
    server: {
        url: 'https://campus-market-frontend-five.vercel.app',
        cleartext: true
    },
    android: {
        allowMixedContent: true
    }
};

export default config;
