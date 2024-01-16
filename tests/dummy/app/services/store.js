import Store from '@ember-data/store';
// import Store, { CacheHandler } from '@ember-data/store';
// import RequestManager from '@ember-data/request';
// import Fetch from '@ember-data/request/fetch';
// import { LegacyNetworkHandler } from '@ember-data/legacy-compat';
export default class CustomStore extends Store {
  constructor() {
    super(...arguments);
    // this.requestManager = new RequestManager();
    // this.requestManager.use([LegacyNetworkhandler, Fetch]);
    // this.requestManager.useCache(CacheHandler);
  }
}
