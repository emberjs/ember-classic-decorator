/* globals module */

module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: 'classic-decorator-transform',

    visitor: {
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
                  t.identifier('add')
                ),
                [t.identifier(path.node.id.name)]
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
                      t.identifier('add')
                    ),
                    [t.identifier(path.node.id.name)]
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
