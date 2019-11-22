import Transform from '@ember-data/serializer/transform';

export default class TestTransform extends Transform {
  serialize(v) {
    return v;
  }

  deserialize(v) {
    return v;
  }
}
