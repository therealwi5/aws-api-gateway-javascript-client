/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
/* eslint-disable */

// import 'babel-polyfill';
import uritemplate from 'url-template';
import apiGatewayClientFactory from './lib/apiGatewayCore/apiGatewayClient';

const apigClientFactory = {};

const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => (obj[key] && typeof obj[key] === 'object') && removeEmpty(obj[key]) || (obj[key] === undefined) && delete obj[key]);
  return obj;
};

apigClientFactory.newClient = (config = {}) => {
  const apigClient = {};

  config = Object.assign({
    accessKey: '',
    secretKey: '',
    sessionToken: '',
    region: 'us-east-1',
    apiKey: '',
    invokeUrl: '',
    service: 'execute-api',
    defaultContentType: 'application/json',
    defaultAcceptType: 'application/json',
    systemClockOffset: 0,
    host: ''
  }, removeEmpty(config));

  // extract endpoint and path from url
  const invokeUrl = config.invokeUrl;
  const endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
  const pathComponent = invokeUrl.substring(endpoint.length);

  const sigV4ClientConfig = {
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    sessionToken: config.sessionToken,
    serviceName: config.service,
    region: config.region,
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType,
    systemClockOffset: config.systemClockOffset,
    retries: config.retries,
    retryCondition: config.retryCondition
  };

  let authType = 'NONE';
  if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
    authType = 'AWS_IAM';
  }

  const simpleHttpClientConfig = {
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType,
    retries: config.retries,
    retryCondition: config.retryCondition
  };

  const apiGatewayClient = apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);

  apigClient.invokeApi = (path, method, data = '', requestConfig = {}) => {
    let params = requestConfig.params ? requestConfig.params : {};
    let headers = config.headers ? config.headers : {};

    if (requestConfig && requestConfig.headers) {
      headers = Object.assign(headers, requestConfig.headers);
    }

    const request = {
      verb: method.toUpperCase(),
      path: pathComponent + path,
      headers,
      queryParams: params,
      body: data
    };

    return apiGatewayClient.makeRequest(request, authType, requestConfig, config.apiKey);
  };

  return apigClient;
};

export default apigClientFactory;
