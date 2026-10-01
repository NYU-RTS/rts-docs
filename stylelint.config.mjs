/** @author Ka Pui (August) Cheung */
// @ts-check

/**
 * @type {import("stylelint").Config}
 * @see https://stylelint.io/user-guide/configure
 */
const stylelintConfig = {
  extends: ["stylelint-config-standard", "stylelint-config-rational-order"],
  overrides: [
    {
      files: ["src/css/custom.css"],
      rules: {
        "selector-class-pattern": null,
      },
    },
    {
      files: ["**/*.module.css"],
      rules: {
        "selector-class-pattern": [
          "^[a-z][a-zA-Z0-9]+$",
          {
            /** @param {string} selector */
            message: (selector) =>
              `Expected class selector "${selector}" to be camelCase`,
          },
        ],
      },
    },
  ],
};

export default stylelintConfig;
