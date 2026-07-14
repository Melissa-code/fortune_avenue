import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser },
    // custom rules: _banque paramètre inutilisé par ex dans Carte.js (pour polymorphisme)
    rules: {
      "no-unused-vars": ["error", { 
        "args": "after-used", 
        "argsIgnorePattern": "^_" 
      }]
    }
  },
]);
