export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.ts?$': [ 'ts-jest', {
            babelConfig: true,
            useESM: true,
        }],
        '^.+\\.tsx?$': [ 'ts-jest', {
            babelConfig: true,
            useESM: true,
        }]
    },
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
