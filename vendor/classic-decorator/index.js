'use strict';

/* globals Ember, define */
(function(global) {
  var OWN_CLASSES = new WeakMap();
  var HAS_CONSTRUCTOR = new WeakMap();
  var IS_CLASSIC = new WeakMap();
  var BASE_CLASSES = new WeakMap();
  var IS_PERMA_CLASSIC = new WeakMap();
  global.__CLASSIC_HAS_CONSTRUCTOR__ = HAS_CONSTRUCTOR;
  global.__CLASSIC_OWN_CLASSES__ = OWN_CLASSES;

  const _Ember = typeof require === 'function' && typeof require.has === 'function' && require.has('ember') ? require('ember').default : Ember;

  IS_PERMA_CLASSIC.set(_Ember.Object, true);
  IS_PERMA_CLASSIC.set(_Ember.Component, true);

  IS_PERMA_CLASSIC.set(_Ember.ObjectProxy, false);
  IS_PERMA_CLASSIC.set(_Ember.Application, false);
  IS_PERMA_CLASSIC.set(_Ember.Controller, false);
  IS_PERMA_CLASSIC.set(_Ember.Router, false);
  IS_PERMA_CLASSIC.set(_Ember.Route, false);
  IS_PERMA_CLASSIC.set(_Ember.Service, false);
  IS_PERMA_CLASSIC.set(_Ember.Helper, false);
  if (_Ember.Location) { // Not present from Ember 5.3 onward
    IS_PERMA_CLASSIC.set(_Ember.Location, false);
  }
  if (_Ember.AutoLocation) { // Not present from Ember 5.3 onward
    IS_PERMA_CLASSIC.set(_Ember.AutoLocation, false);
  }
  IS_PERMA_CLASSIC.set(_Ember.HashLocation, false);
  IS_PERMA_CLASSIC.set(_Ember.HistoryLocation, false);
  IS_PERMA_CLASSIC.set(_Ember.NoneLocation, false);

  BASE_CLASSES.set(_Ember.ObjectProxy, true);
  BASE_CLASSES.set(_Ember.CoreObject, true);
  BASE_CLASSES.set(_Ember.Object, true);
  BASE_CLASSES.set(_Ember.Application, true);
  BASE_CLASSES.set(_Ember.Controller, true);
  BASE_CLASSES.set(_Ember.Router, true);
  BASE_CLASSES.set(_Ember.Route, true);
  BASE_CLASSES.set(_Ember.Service, true);
  BASE_CLASSES.set(_Ember.Helper, true);
  if (_Ember.Location) { // Not present from Ember 5.3 onward
    BASE_CLASSES.set(_Ember.Location, true);
  }

  function getClassName(klass) {
    var klassToString = klass.toString();
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

  _Ember.Object.reopenClass({
    create: function create() {
      // We can't actually use `new` as an alternative here, but most classes
      // don't need to be created by users, so no reason to assert in the
      // general case.
      var ret = this._super.apply(this, arguments);

      if (OWN_CLASSES.get(this) && !IS_CLASSIC.has(this)) {
        var permaClassicAncestor = findAncestor(this, function(klass) {
          return IS_PERMA_CLASSIC.has(klass);
        });

        if (
          permaClassicAncestor &&
          IS_PERMA_CLASSIC.get(permaClassicAncestor)
        ) {
          throw new Error(
            'You defined the class '
              .concat(getClassName(this), ' that extends from ')
              .concat(
                getClassName(permaClassicAncestor),
                " using native class syntax, but you didn't mark it with the @classic decorator. All user classes that extend from this class must be marked as @classic, since they use classic features. If you want to remove the @classic decorator, you must remove the base class. For components, you can do this by converting to Glimmer components. For plain classes that extend from EmberObject, you can convert them into plain native classes that do not extend from EmberObject.\n\n" +
                "If this class is a base class provided by the framework that you should be allowed to remove @classic from, please open an issue on the classic decorators repo: https://github.com/emberjs/ember-classic-decorator"
              )
          );
        }

        if (HAS_CONSTRUCTOR.has(this)) {
          var ancestorWithInit = findAncestor(this, function(klass) {
            return (
              klass.prototype.hasOwnProperty('init') || BASE_CLASSES.has(klass)
            );
          });

          if (ancestorWithInit !== null && !BASE_CLASSES.has(ancestorWithInit)) {
            throw new Error(
              'You defined the class '
                .concat(
                  getClassName(this),
                  " with a 'constructor' function, but one of its ancestors, "
                )
                .concat(
                  getClassName(ancestorWithInit),
                  ", uses the 'init' method. Due to the timing of the constructor and init methods, its not generally safe to use 'constructor' for class setup if the parent class is using 'init'. You can mark "
                )
                .concat(
                  getClassName(this),
                  " with the @classic decorator and safely use 'init', or you can convert the parent class to use native classes, and switch from 'init' to 'constructor' there first.\n\n" +
                  "If this error message is not being triggered by your code or code from an addon, but from Ember itself, please file a bug report on the classic decorator repo: https://github.com/emberjs/ember-classic-decorator"
                )
            );
          }
        }
      }

      return ret;
    },
    reopen: function reopen() {
      if (OWN_CLASSES.get(this) && !IS_CLASSIC.has(this)) {
        throw new Error(
          'You attempted to use the .reopen() method on the '.concat(
            getClassName(this),
            " class, but it's not a classic class! Redefining classes after they have been defined is generally considered an antipattern.\n\n" +
            "If this error message is not being triggered by your code or code from an addon, but from Ember itself, please file a bug report on the classic decorator repo: https://github.com/emberjs/ember-classic-decorator"
          )
        );
      }

      var ret = this._super.apply(this, arguments);

      return ret;
    },
    reopenClass: function reopenClass() {
      if (OWN_CLASSES.get(this) && !IS_CLASSIC.has(this) && !_Ember.Application.detect(this) && !_Ember.Router.detect(this)) {
        throw new Error(
          'You attempted to use the .reopen() method on the '.concat(
            getClassName(this),
            " class, but it's not a classic class! Redefining classes after they have been defined is generally considered an antipattern. If you were reopening this class to add static class fields or methods, you can now define those with the 'static' keyword instead.\n\n" +
            "If this error message is not being triggered by your code or code from an addon, but from Ember itself, please file a bug report on the classic decorator repo: https://github.com/emberjs/ember-classic-decorator"
          )
        );
      }

      var ret = this._super.apply(this, arguments);

      return ret;
    },
  });

  global.__EMBER_CLASSIC_DECORATOR = function classic(target) {
    IS_CLASSIC.set(target, true);
    return target;
  }

  let originalRequire = window.require;
  let originalRequireEntries = Object.entries(window.require);

  window.require = require = function patchData(moduleName) {
    var DS, Resolver;

    try {
      Resolver = originalRequire('ember-resolver').default;
      DS = originalRequire('ember-data').default;
    } catch (e) {}

    if (Resolver) {
      BASE_CLASSES.set(Resolver, true);
      IS_PERMA_CLASSIC.set(Resolver, false);
    }

    if (DS) {
      BASE_CLASSES.set(DS.Store, true);
      BASE_CLASSES.set(DS.Model, true);
      BASE_CLASSES.set(DS.Adapter, true);
      BASE_CLASSES.set(DS.Serializer, true);
      BASE_CLASSES.set(DS.Transform, true);

      IS_PERMA_CLASSIC.set(DS.Store, false);
      IS_PERMA_CLASSIC.set(DS.Model, false);
      IS_PERMA_CLASSIC.set(DS.Adapter, false);
      IS_PERMA_CLASSIC.set(DS.Serializer, false);
      IS_PERMA_CLASSIC.set(DS.Transform, false);
    }

    window.require = require = window.requirejs;

    return window.requirejs(moduleName);
  }

  originalRequireEntries.forEach(
    ([key, value]) => (window.require[key] = value)
  );
})(window);
