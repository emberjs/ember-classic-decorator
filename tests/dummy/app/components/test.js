import Component from '@ember/component';
import ObjectProxy from '@ember/object/proxy';
import classic from 'ember-classic-decorator';

class MyProxy extends ObjectProxy {
  foo = 123;
  content = {};
}

@classic
export default class Test extends Component {
  init() {
    super.init(...arguments);
    this.proxy = MyProxy.create();
  }
}
