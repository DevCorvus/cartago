const nextJest = require('next/jest');

const createJestCofig = nextJest({ dir: './' });

module.exports = createJestCofig();
