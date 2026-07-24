// Generate best configuration for eslint backend
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import security from 'eslint-plugin-security'

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    security.configs.recommended,
    {
        rules: {
            // TypeScript
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/explicit-module-boundary-types": "off",

            // Possible Errors
            "no-console": "warn",
            "no-debugger": "warn",
            "no-alert": "error",

            // Best Practices
            "eqeqeq": "error",
            "no-else-return": "error",
            "no-return-await": "error",
            "no-throw-literal": "error",
            "require-await": "error",

            // Variables
            "no-unused-vars": ["error", { "args": "none" }],
            "no-undef": "error",
            "no-shadow": "error",

            // Node.js & CommonJS
            "no-path-concat": "error",
            "no-process-exit": "error",
            "no-sync": "error",

            // Style & Formatting (Prettier handles most of this)
            "semi": ["error", "always"],
            "quotes": ["error", "single"],
            "comma-dangle": ["error", "always-multiline"],
            "indent": ["error", 2, { "SwitchCase": 1 }],

            // Security
            "no-eval": "error",
            "security/detect-object-injection": "warn"
        }
    }
);
