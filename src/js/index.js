import apigClientFactory from './apigClient';

export default class {
  constructor(config) {
    this.client = apigClientFactory.newClient(config);

    ['delete', 'get', 'head'].forEach((method) => {
      this[method] = (url, config) => {
        return this.invokeApi(url, method.toUpperCase(), '', config);
      };
    });

    ['post', 'put', 'patch'].forEach((method) => {
      this[method] = (url, data = '', config) => {
        return this.invokeApi(url, method.toUpperCase(), data, config);
      };
    });
  }

  invokeApi(url, method, data, config) {
    return this.client.invokeApi(url, method, data, config);
  }
}
