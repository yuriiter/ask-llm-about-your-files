import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports"; // Import the plugin
import eslintPluginImport from "eslint-plugin-import"; // Import for no-unused-modules rule

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const config = [
    ...compat.extends("next/core-web-vitals"),
    {
        plugins: {
            "unused-imports": unusedImports,
            "import": eslintPluginImport,
        },
        rules: {
            "unused-imports/no-unused-imports": "warn",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
            "import/no-unused-modules": [
                "warn",
                {
                    unusedExports: true,
                    missingExports: false,
                    ignoreUnusedTypeExports: true,
                },
            ],
        },
    },
];

// eslint-disable-next-line import/no-unused-modules
export default config
