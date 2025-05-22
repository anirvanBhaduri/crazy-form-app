import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    globalIgnores(['node_modules', 'dist', './eslint.config.mjs']),
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
