module.exports = {
    extends: [
      'next',
      'next/core-web-vitals',
      'plugin:react-hooks/recommended',
    ],
    plugins: ['react-hooks'],
    rules: {
        "react-hooks/rules-of-hooks": "off",
        'react-hooks/exhaustive-deps': 'warn',
    },
  };
  