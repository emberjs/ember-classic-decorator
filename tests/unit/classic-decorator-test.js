import { module, test } from 'qunit';

import EmberObject from '@ember/object';
import Controller from '@ember/controller';
import classic from 'ember-classic-decorator';
import { DEBUG } from '@glimmer/env';

module('@classic', () => {
  if (DEBUG) {
    module('permaclassic classes', () => {
      // eslint-disable-next-line qunit/require-expect
      test('undecorated perma classes always throw', (assert) => {
        assert.throws(() => {
          class Foo extends EmberObject {}

          Foo.create();
        }, /You defined the class Foo that extends from Ember.Object using native class syntax, but you didn't mark it with the @classic decorator/);
      });

      test('decorated perma classes do not throw', (assert) => {
        assert.expect(0);

        @classic
        class Foo extends EmberObject {}

        Foo.create();
      });

      test('classes defined with classic syntax do not throw', (assert) => {
        assert.expect(0);

        const Foo = EmberObject.extend({});

        Foo.create();
      });
    });

    module('constructor / init', () => {
      test('does not throw if classes are interleaved', (assert) => {
        assert.expect(0);

        const FooController = Controller.extend();

        @classic
        class BarController extends FooController {
          foo = 123;
        }

        class BazController extends BarController {
          foo = 456;
        }

        @classic
        class QuxController extends BazController {}

        const QuuxController = QuxController.extend();

        QuuxController.create();
      });

      // eslint-disable-next-line qunit/require-expect
      test('throws an error if subclass uses constructor and parent class uses init', (assert) => {
        assert.throws(() => {
          const FooController = Controller.extend({
            init() {
              this._super(...arguments);
            },
          });

          class BarController extends FooController {
            constructor() {
              super(...arguments);
            }
          }

          BarController.create();
        }, /You defined the class BarController with a 'constructor' function, but one of its ancestors, Class, uses the 'init' method/);
      });
    });

    module('static class methods', () => {
      module('reopen', () => {
        test('works with the decorator', (assert) => {
          assert.expect(0);

          @classic
          class FooController extends Controller {}

          FooController.reopen({});
        });

        test('works with classic classes', (assert) => {
          assert.expect(0);

          const FooController = Controller.extend({});

          FooController.reopen({});
        });

        // eslint-disable-next-line qunit/require-expect
        test('throws without the decorator', (assert) => {
          assert.throws(() => {
            class FooController extends Controller {}

            FooController.reopen({});
          }, /You attempted to use the .reopen\(\) method on the FooController class/);
        });
      });

      module('reopenClass', () => {
        test('works with the decorator', (assert) => {
          assert.expect(0);

          @classic
          class FooController extends Controller {}

          FooController.reopenClass({});
        });

        test('works with classic classes', (assert) => {
          assert.expect(0);

          const FooController = Controller.extend({});

          FooController.reopenClass({});
        });

        // eslint-disable-next-line qunit/require-expect
        test('throws without the decorator', (assert) => {
          assert.throws(() => {
            class FooController extends Controller {}

            FooController.reopenClass({});
          }, /You attempted to use the .reopen\(\) method on the FooController class/);
        });
      });
    });
  } else {
    test('nothing is included or decorated', (assert) => {
      assert.expect(0);

      @classic
      class FooController extends Controller {
        init() {
          super.init(...arguments);
        }
      }

      class BarController extends FooController {
        constructor() {
          super(...arguments);
        }
      }

      BarController.create();
      FooController.create();
    });
  }
});
