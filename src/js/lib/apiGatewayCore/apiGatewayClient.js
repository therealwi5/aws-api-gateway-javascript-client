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
import utils from './utils';
import sigV4ClientFactory from './sigV4Client.js';
import simpleHttpClientFactory from './simpleHttpClient.js';

const apiGatewayClientFactory = {};
apiGatewayClientFactory.newClient = function(simpleHttpClientConfig, sigV4ClientConfig) {
  let apiGatewayClient = { };
  // Spin up 2 httpClients, one for simple requests, one for SigV4
  let sigV4Client = sigV4ClientFactory.newClient(sigV4ClientConfig);
  let simpleHttpClient = simpleHttpClientFactory.newClient(simpleHttpClientConfig);

  apiGatewayClient.makeRequest = function(request, authType, requestConfig, apiKey) {
    // Default the request to use the simple http client
    let clientToUse = simpleHttpClient;

    // Attach the apiKey to the headers request if one was provided
    if (apiKey !== undefined && apiKey !== '' && apiKey !== null) {
      request.headers['x-api-key'] = apiKey;
    }

    if (
      request.body === undefined
      || request.body === ''
      || request.body === null
      || Object.keys(request.body).length === 0
    ) {
      request.body = undefined;
    }

    // If an auth type was specified inject the appropriate auth client
    if (authType === 'AWS_IAM') {
      clientToUse = sigV4Client;
    }

    // Call the selected http client to make the request,
    // returning a promise once the request is sent
    return clientToUse.makeRequest(request, requestConfig);
  };
  return apiGatewayClient;
};

export default apiGatewayClientFactory;
