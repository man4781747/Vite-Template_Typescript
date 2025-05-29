module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true, // for defineProps, defineEmits
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // Use vue3-recommended for stricter rules
    'plugin:@typescript-eslint/recommended',
    '@vue/eslint-config-typescript', // Adjusted from @vue/eslint-config-typescript/recommended for ESLint 8 compat
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parser: 'vue-eslint-parser', // Primary parser for .vue files
  parserOptions: {
    parser: '@typescript-eslint/parser', // Parser for <script> blocks in .vue files
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'vue',
    // 'prettier' is included by plugin:prettier/recommended
  ],
  rules: {
    // Add custom rules or overrides here if needed later
    // e.g., 'vue/multi-word-component-names': 'off', if simple component names are preferred for examples
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['HomePage', 'SimpleGreeting'], // Allow specific single-word names if necessary for existing files
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        // Show Prettier issues as warnings
        semi: false, // Example: align with Prettier config
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
    ],
    // Add other rules as needed
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.d.ts',
    'vite.config.js.timestamp-*',
    '.eslintrc.cjs',
    '.prettierrc.json',
    '.prettierignore',
  ],
}
