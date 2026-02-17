/** Optional Jest config merged on top of @angular-builders/jest defaults. */
module.exports = {
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
  },
};
