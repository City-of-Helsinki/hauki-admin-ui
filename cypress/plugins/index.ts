/// <reference types="cypress" />
/// <reference types="node" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

// module.exports = function (on, config)
module.exports = function plugins(on: Cypress.PluginEvents): void {
  on('task', {
    log(message: string) {
      // eslint-disable-next-line no-console
      console.log(message);
      return null;
    },
  });
};
