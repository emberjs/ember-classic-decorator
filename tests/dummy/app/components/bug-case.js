// this gets imported directly into the test suite. It's in a separate file
// because the bad behavior seems to depend specifically on `export default
// class` plus a decorated property.

import Component from '@ember/component';
import { inject } from '@ember/service'

export default class Example extends Component {
  @inject router;
}

