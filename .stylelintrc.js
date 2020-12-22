const absoluteFilePath = (file) => `${__dirname}${file}`;

module.exports = {
  extends: "stylelint-config-standard",
  plugins: [
    "stylelint-value-no-unknown-custom-properties"
  ],
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ["extend", "include", "mixin"]
    }],
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
