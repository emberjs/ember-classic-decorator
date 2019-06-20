/* globals Ember, define */
(function() {
  const OWN_CLASSES = new WeakSet();
  const HAS_CONSTRUCTOR = new WeakSet();
  const IS_CLASSIC = new WeakSet();
  const BASE_CLASSES = new WeakSet();

  const IS_PERMA_CLASSIC = new WeakMap();

  window.__CLASSIC_HAS_CONSTRUCTOR__ = HAS_CONSTRUCTOR;
  window.__CLASSIC_OWN_CLASSES__ = OWN_CLASSES;

  IS_PERMA_CLASSIC.set(Ember.Object, true);
  IS_PERMA_CLASSIC.set(Ember.Component, true);

  IS_PERMA_CLASSIC.set(Ember.Controller, false);
  IS_PERMA_CLASSIC.set(Ember.Route, false);
  IS_PERMA_CLASSIC.set(Ember.Service, false);
  IS_PERMA_CLASSIC.set(Ember.Helper, false);

  BASE_CLASSES.add(Ember.CoreObject);
  BASE_CLASSES.add(Ember.Object);
  BASE_CLASSES.add(Ember.Controller);
  BASE_CLASSES.add(Ember.Route);
  BASE_CLASSES.add(Ember.Service);
  BASE_CLASSES.add(Ember.Helper);

  function getClassName(klass) {
    let klassToString = klass.toString();

    return klassToString.includes('(unknown)') ? klass.name : klassToString;
  }

  function findAncestor(klass, predicate) {
    while (klass !== null && Boolean(klass.prototype)) {
      if (predicate(klass)) {
        return klass;
      }

      klass = Object.getPrototypeOf(klass);
    }

    return null;
  }

  Ember.Object.reopenClass({
    create() {
      // We can't actually use `new` as an alternative here, but most classes
      // don't need to be created by users, so no reason to assert in the
      // general case.
      let ret = this._super(...arguments);

      if (OWN_CLASSES.has(this) && !IS_CLASSIC.has(this)) {
        let permaClassicAncestor = findAncestor(this, klass =>
          IS_PERMA_CLASSIC.has(klass)
        );

        if (
          permaClassicAncestor &&
          IS_PERMA_CLASSIC.get(permaClassicAncestor)
        ) {
          throw new Error(
            `You defined the class ${getClassName(
              this
            )} that extends from ${getClassName(
              permaClassicAncestor
            )} using native class syntax, but you didn't mark it with the @classic decorator. All user classes that extend from this class must be marked as @classic, since they use classic features. If you want to remove the @classic decorator, see the guides on how to convert this class into the Octane version: [TODO_GUIDE_LINK]`
          );
        }

        if (HAS_CONSTRUCTOR.has(this)) {
          let ancestorWithInit = findAncestor(
            this,
            klass =>
              klass.prototype.hasOwnProperty('init') && !BASE_CLASSES.has(klass)
          );

          if (ancestorWithInit !== null) {
            throw new Error(
              `You defined the class ${getClassName(
                this
              )} with a 'constructor' function, but one of its ancestors, ${getClassName(
                ancestorWithInit
              )}, uses the 'init' method. Due to the timing of the constructor and init methods, its not generally safe to use 'constructor' for class setup if the parent class is using 'init'. You can mark ${getClassName(
                this
              )} with the @classic decorator and safely use 'init', or you can convert the parent class to use native classes, and switch from 'init' to 'constructor' there first. See the guides for more details: [TODO_GUIDE_LINK]`
            );
          }
        }
      }

      return ret;
    },

    reopen() {
      if (OWN_CLASSES.has(this) && !IS_CLASSIC.has(this)) {
        throw new Error(
          `You attempted to use the .reopen() method on the ${getClassName(
            this
          )} class, but it's not a classic class! Redefining classes after they have been defined is generally considered an antipattern. See the upgrade guide for suggestions and alternatives: [TODO_GUIDE_LINK]`
        );
      }

      let ret = this._super(...arguments);

      return ret;
    },

    reopenClass() {
      if (OWN_CLASSES.has(this) && !IS_CLASSIC.has(this)) {
        throw new Error(
          `You attempted to use the .reopen() method on the ${getClassName(
            this
          )} class, but it's not a classic class! Redefining classes after they have been defined is generally considered an antipattern. If you were reopening this class to add static class fields or methods, you can now define those with the 'static' keyword instead. See the upgrade guide for suggestions and alternatives: [TODO_GUIDE_LINK]`
        );
      }

      let ret = this._super(...arguments);

      return ret;
    },
  });

  define('ember-classic-decorator', ['exports'], function(exports) {
    Object.defineProperty(exports, '__esModule', { value: true });

    exports.default = function classic(target) {
      IS_CLASSIC.add(target);

      return target;
    };
  });
})();
