'use strict';

const { hasPlugin, addPlugin } = require('ember-cli-babel-plugin-helpers');

function isProductionEnv() {
  return /production/.test(process.env.EMBER_ENV);
}

module.exports = {
  name: require('./package').name,

  included(parent) {
    this._super.included.apply(this, arguments);

    if (isProductionEnv()) {
      if (!hasPlugin(parent, 'filter-imports:ember-classic-decorator')) {
        addPlugin(parent, [
          require.resolve('babel-plugin-filter-imports'),
          {
            imports: {
              'ember-classic-decorator': ['classic'],
            },
          },
          'filter-imports:ember-classic-decorator',
        ]);
      }
    } else {
      this.import('vendor/classic-decorator/index.js');

      if (!hasPlugin(parent, 'classic-decorator-transform')) {
        addPlugin(parent, require.resolve('./lib/classic-decorator-transform'));
      }
    }
  },
};
