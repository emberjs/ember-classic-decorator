# ember-classic-decorator

This addon provides a dev-time only class decorator, `@classic`. This decorator
gets removed from production builds, and is entirely for the purpose of helping
you navigate the upgrade from Ember's _classic class_ system to native classes
in Ember Octane!


## Installation

First, install the addon:

```
ember install ember-classic-decorator
```

You should also ensure you are using the latest version of the [Ember eslint
plugin](https://github.com/ember-cli/eslint-plugin-ember) and enable the related
eslint rules to gain the full benefits of the decorator:

```js
// .eslintrc.js

  // ...
  rules: {
    'ember/classic-decorator-hooks': 'error',
    'ember/classic-decorator-no-classic-methods': 'error'
  },
  // ...
```

### Why do I need this decorator?

While you can now use native class syntax to extend from any Ember base class,
there are still a few differences between classic classes and native classes
that can be a little tricky during the conversion:

- `init` and `constructor` are two separate methods that are called at different
  times. If you convert a class to native class syntax and change its
  `init` function to `constructor`, then it will run before any of its parent
  classes' `init` methods. This could leave you in an inconsistent state, and
  cause subtle bugs.
- Ember's classic class system uses many static class methods such as `create`,
  `reopen`, and `reopenClass`, which do not have native class equivalents. Some
  classes will need to be redesigned to account for this.
- All Ember classes have a number of methods, like `get`, `set`,
  `incrementProperty`, and `notifyPropertyChange`. In the future, most of these
  methods will not be necessary, and will not exist on future base classes like
  Glimmer components.
- Speaking of Glimmer components - if you convert your application to native
  classes, and then start converting each component to Glimmer components, it
  could get confusing very quickly. Is this component class a Glimmer component,
  or a classic component?

`@classic` provides a hint to you, the developer, that this class uses classic
APIs and base classes, and still has some work to do before it can be marked as
fully converted to Octane conventions.

### What does it do?

When installed, `@classic` will modify Ember classes to assert if certain APIs
are used, and lint against other APIs being used, _unless_ a class is defined
with classic class syntax, or decorated with `@classic`.

The following APIs will throw an error if used in a non-classic class:

* `reopen`
* `reopenClass`

The following APIs will cause a _lint_ error if used in a non-classic class
_definition_. Since we cannot know everywhere that the class is used, instances
of the class may still use these methods and will not cause assertions or lint
errors:

  - `get`
  - `set`
  - `getProperties`
  - `setProperties`
  - `getWithDefault`
  - `incrementProperty`
  - `decrementProperty`
  - `toggleProperty`
  - `addObserver`
  - `removeObserver`
  - `notifyPropertyChange`

In addition, `@classic` will prevent users from using `constructor` in
subclasses if the parent class has an `init` method, to prevent bugs caused by
timing issues.

### Which classes must be marked as @classic?

Certain classes must _always_ be marked as classic:

- Classic components
- Utility classes that extend directly from `EmberObject`

These must be marked as classic because their APIs are intrinsically tied to the
classic class model. To remove the `@classic` decorator from them, you can:

- Convert classic components to Glimmer components
- Rewrite utility classes so they do not extend from `EmberObject` at all, and
  only use native class syntax.

Other classes can be converted incrementally to remove classic APIs, including:

- Routes
- Services
- Controllers
- Class based helpers

### How do I refactor and remove @classic?

In order to remove the classic decorator from a class, you must:

- Remove usage of mixins from the class
- Remove usage of static class methods on the class, such as `reopen` and
  `reopenClass`
- Remove usage of classic class methods within the class definition, including:
  - `get`
  - `set`
  - `getProperties`
  - `setProperties`
  - `getWithDefault`
  - `incrementProperty`
  - `decrementProperty`
  - `toggleProperty`
  - `addObserver`
  - `removeObserver`
  - `notifyPropertyChange`

## Compatibility

- Ember.js v3.24 or above
- Ember CLI v3.24 or above
- Node.js v12 or above

## Usage

Apply the `@classic` decorator to any classes that should use classic APIs.

```js
import EmberObject from '@ember/object';
import classic from 'ember-classic-decorator';

@classic
export default class Foo extends EmberObject {}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
