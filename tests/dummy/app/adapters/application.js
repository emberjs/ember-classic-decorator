import RESTAdapter from '@ember-data/adapter/rest';
import classic from 'ember-classic-decorator';

@classic
export default class MyRESTAdapter extends RESTAdapter {
  namespace = 'api';
  buildURL() {
    let url = super.buildURL(...arguments);
    return `${url}.json`;
  }
}
