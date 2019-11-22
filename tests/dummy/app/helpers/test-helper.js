import { helper } from '@ember/component/helper';

export function testHelper(params/*, hash*/) {
  return params[0];
}

export default helper(testHelper);
