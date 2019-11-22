import RESTAdapter from '@ember-data/adapter/rest';

export default class MyRESTAdapter extends RESTAdapter {
  namespace = 'api';
}
