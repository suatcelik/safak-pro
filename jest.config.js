// Jest yapılandırması
// Kurulum için: npm install --save-dev jest @testing-library/react-native jest-expo @types/jest
module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/react-native'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind)',
    ],
    testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
    ],
};
