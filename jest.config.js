/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './',
    moduleFileExtensions: ['ts', 'js', 'json'],
    testRegex: '.*\\.spec\\.ts$',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};