// Jest yapılandırması
// Kurulum: npm install --save-dev jest jest-expo @types/jest @testing-library/react-native react-test-renderer@19.1.0
module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind)',
    ],
    testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
    ],
};
