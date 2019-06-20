'use strict';

function isProductionEnv() {
  return /production/.test(process.env.EMBER_ENV);
}

module.exports = {
  name: require('./package').name,

  included(parent) {
    this._super.included.apply(this, arguments);

    if (!isProductionEnv()) {
      const {
        hasPlugin,
        addPlugin,
      } = require('ember-cli-babel-plugin-helpers');

      this.import('vendor/classic-decorator/index.js');

      if (!hasPlugin(parent, 'classic-decorator-transform')) {
        addPlugin(parent, require.resolve('./lib/classic-decorator-transform'));
      }
    }
  },
};
