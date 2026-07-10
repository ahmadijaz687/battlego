const path = require('path');

module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@mobile/(.*)$': '<rootDir>/mobile/src/$1',
    '^@shared/(.*)$': '<rootDir>/../packages/shared/$1',
    '^@theme/(.*)$': '<rootDir>/../packages/theme/$1',
    '^@ui/(.*)$': '<rootDir>/../packages/ui/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-reanimated|@shopify/flash-list|react-native-gesture-handler|lottie-react-native|react-native-calendars|react-native-chart-kit|react-native-confetti-cannon|react-native-keyboard-aware-scroll-view|react-native-markdown-display|react-native-mmkv|react-native-modal|react-native-render-html|react-native-safe-area-context|react-native-screens|react-native-toast-message|react-native-web)',
  ],
  testMatch: ['**/__tests__/**/*.(test|spec).[jt]s?(x)', '**/*.(test|spec).[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
