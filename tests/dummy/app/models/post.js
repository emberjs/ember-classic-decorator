import Model, { attr } from '@ember-data/model';

export default class Post extends Model {
  @attr title;
  @attr('test') author;
}
