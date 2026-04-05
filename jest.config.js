// Jest yapılandırması
// Kurulum için: npm install --save-dev jest @testing-library/react-native jest-expo @types/jest
module.exports = {
    preset: 'jest-expo',
    setupFilesAfterFramework: ['@testing-library/react-native/extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind)',
    ],
    testPathPattern: '__tests__',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
    ],
};
