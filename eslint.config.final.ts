/**
 * FINAL ESLint Config - ONLY app/ directory NO RULES
 */

export default [
  {
    // Ignore everything except app/
    ignores: [
      '**/*',
      '!app/**/*.ts',
      '!app/**/*.tsx'
    ]
  }
];
