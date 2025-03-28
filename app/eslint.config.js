import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,jsx,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': eslintPluginSimpleImportSort
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowTernary: true,  // Allow ternary operators in TypeScript
          allowShortCircuit: true,
        }
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // External packages come first
            ['^@?\\w'],
            // Internal files
            ['^@/'],
            // Colocated files
            ['^\\.\\./', '^\\./'],
            // Style imports
            ['^.+\\.?(css)$'],
          ],
        },
      ],
    },
  },
)
