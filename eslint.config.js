module.exports = {
  parser: 'babel-eslint', // Use babel-eslint for modern JavaScript features
  extends: [
    'eslint:recommended', // Use recommended ESLint rules
    'plugin:react/recommended', // Use recommended React rules
    'plugin:react-hooks/recommended', // Enforce rules of Hooks
  ],
  env: {
    browser: true, // Enable browser global variables
    node: true, // Enable Node.js global variables
    es6: true, // Enable ES6 features
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  rules: {
    'no-console': 'off', // Allow console statements
    'import/prefer-default-export': 'off', // Allow named exports
    'react/prop-types': 'off', // Disable prop-types as we're using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
  },
};
