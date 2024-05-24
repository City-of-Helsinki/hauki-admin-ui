const absoluteFilePath = (file) => `${__dirname}${file}`;

module.exports = {
  extends: "stylelint-config-standard",
  plugins: [
    "stylelint-value-no-unknown-custom-properties"
  ],
  rules: {
    "selector-class-pattern": null,
    "import-notation": "string",
    "media-query-no-invalid": null,
    "alpha-value-notation": "number",
    "color-function-notation": "legacy",
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ["extend", "include", "mixin"]
    }],
    "declaration-block-no-redundant-longhand-properties": null,
    "declaration-block-no-shorthand-property-overrides": null,
    "shorthand-property-no-redundant-values": null,
    "no-invalid-double-slash-comments": null,
    "font-family-name-quotes": "always-where-recommended",
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        "importFrom": [
          absoluteFilePath('/src/variables.css'),
          absoluteFilePath('/node_modules/hds-core/lib/base.css')
        ]
      }
    ]
  }
}
