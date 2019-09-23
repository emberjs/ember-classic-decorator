/* globals module */
'use strict';

const IS_EMBER_CLASSIC_DECORATORS = /^ember-classic-decorator$/i;

module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: 'classic-decorator-transform',

    visitor: {
      // this will 1. remove `import X from 'ember-classic-decorator';
      // and then 2. will replace it with `const X = __EMBER_CLASSIC_DECORATOR`;
      ImportDeclaration(path) {
        const node = path.node;
        const specifier = node.specifiers[0];
        const moduleName = node.source.value;

        if (!IS_EMBER_CLASSIC_DECORATORS.test(moduleName)) {
          return;
        }

        if (specifier.type !== 'ImportDefaultSpecifier') {
          throw new Error(
            "you must import the default value from `ember-classic-decorator`: import classic from 'ember-classic-decorator';"
          );
        }

        path.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(specifier.local.name),
              t.identifier('__EMBER_CLASSIC_DECORATOR')
            ),
          ])
        );
      },

      ClassDeclaration(path) {
        if (path.node.id) {
          path.insertAfter(
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(
                  t.memberExpression(
                    t.identifier('window'),
                    t.identifier('__CLASSIC_OWN_CLASSES__')
                  ),
                  t.identifier('set')
                ),
                [t.identifier(path.node.id.name), t.booleanLiteral(true)]
              )
            )
          );

          path.node.body.body.forEach(el => {
            if (el.kind === 'constructor') {
              path.insertAfter(
                t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.identifier('window'),
                        t.identifier('__CLASSIC_HAS_CONSTRUCTOR__')
                      ),
                      t.identifier('set')
                    ),
                    [t.identifier(path.node.id.name), t.booleanLiteral(true)]
                  )
                )
              );
            }
          });
        }
      },
    },
  };
};
