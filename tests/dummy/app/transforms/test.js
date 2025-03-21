import Transform from '@ember-data/serializer/transform';
import classic from 'ember-classic-decorator';

@classic
export default class TestTransform extends Transform {
  serialize(v) {
    return v;
  }

  deserialize(v) {
    return v;
  }
}
