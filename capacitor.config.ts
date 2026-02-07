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
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#2badee",
            showSpinner: false,
            androidScaleType: 'CENTER_CROP',
            splashFullScreen: true,
            splashImmersive: true
        },
        StatusBar: {
            style: 'light',
            backgroundColor: "#ffffff"
        }
    }
};

export default config;
