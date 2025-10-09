import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    "rules": {
    "no-unused-vars": "warn",
    "eqeqeq": "warn",
    "semi": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-empty-pattern": "warn",
    "react-refresh/only-export-components": "warn",
    "prefer-const": "warn",
    "react-hooks/rules-of-hooks": "warn",
    "no-useless-escape": "warn",
    "no-empty": "warn"
  }
  },
  
])
