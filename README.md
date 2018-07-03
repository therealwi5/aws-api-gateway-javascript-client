This is a simple Axios wrapper for AWS Api Gateway client. It simplifies the process of signing each request using Signature V4.
In order to use the app import it to your project.

```
import ApiGatewayJsClient from 'aws-api-gateway-javascript-client'
```

Then initiate the constructor

```
const api = new ApiGatewayJsClient({
  invokeUrl: 'https://apidomainexample.com',
  accessKey: 'Example Access Key',
  secretKey: 'Example Secret Key',
  region: 'eu-west-2',
  headers: {
    host: 'example.host.com'
  }
});
```

You can now start making requests using the instance. All the access

Example post request

```
api.post('/sample-path', {
  url: 'hello world'
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
```

Example get request

```
api.get('/sample-path', {
  params: {
  	foo: 'bar'
  }
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
```
