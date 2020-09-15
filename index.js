'use strict';

function isProductionEnv() {
  return /production/.test(process.env.EMBER_ENV);
}

module.exports = {
  name: require('./package').name,

  _getParentOptions() {
    let options;

    // The parent can either be an Addon or a Project. If it's an addon,
    // we want to use the app instead. This public method probably wasn't meant
    // for this, but it's named well enough that we can use it for this purpose.
    if (this.parent && !this.parent.isEmberCLIProject) {
      options = this.parent.options = this.parent.options || {};
    } else {
      options = this.app.options = this.app.options || {};
    }

    return options;
  },

  included(parent) {
    this._super.included.apply(this, arguments);

    let parentOptions = this._getParentOptions();

    // Create babel options if they do not exist
    parentOptions.babel = parentOptions.babel || {};
    parentOptions.babel.plugins = parentOptions.babel.plugins || [];

    // We emit macros from our babel plugin, which means our parent also needs
    // the macros babel plugin.
    this.addons.find(a => a.name === '@embroider/macros').installBabelPlugin(parent);

    if (isProductionEnv()) {
      let hasPlugin = parentOptions.babel.plugins
        .filter(definition => Array.isArray(definition))
        .some(
          definition =>
            definition[2] === 'filter-imports:ember-classic-decorator'
        );

      if (!hasPlugin) {
        parentOptions.babel.plugins.push([
          require.resolve('babel-plugin-filter-imports'),
          {
            imports: {
              'ember-classic-decorator': ['default'],
            },
          },
          'filter-imports:ember-classic-decorator',
        ]);
      }
    } else {
      this.import('vendor/classic-decorator/index.js');

      let hasPlugin = parentOptions.babel.plugins.some(
        definition =>
          typeof definition === 'string' &&
          definition.match('classic-decorator-transform')
      );

      if (!hasPlugin) {
        parentOptions.babel.plugins.push(
          require.resolve('./lib/classic-decorator-transform-v4')
        );
      }
    }
  },
};
