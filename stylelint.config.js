module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-prettier/recommended",
    "stylelint-config-html",
    // Uncomment if you use Tailwind CSS
    // 'stylelint-config-tailwindcss',
  ],
  rules: {
    // Customize your rules here
    "prettier/prettier": true,
    "block-no-empty": true,
    "color-no-invalid-hex": true,
  },
};
