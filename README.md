# jsonsocket-light
JSON sockets 100% compatible with nodejs net.Socket

## INSTALL

```
$ npm install jsonsocket-light
```

## Usage

```js
var jsonsocket_mutate = require('jsonsocket-light');

jsonsocket_mutate(socket);
```

## Methods
### `jsonsocket_mutate(socket, [json_event])`

Decorate a [`net.Socket`](https://nodejs.org/api/net.html#net_class_net_socket) or [`tls.TLSSocket`](https://nodejs.org/api/tls.html#tls_class_tls_tlssocket).

```js
jsonsocket_mutate(socket);

socket.on('data', function(data) {
    if(!jsonsocket_mutate.isJson(data)) {
        // not yet JSONified
        return;
    }
    console.log("This is JSON:", data)
}).write({
    username: "David",
    company: "IDCWARE"
});
```

### `jsonsocket_mutate(socket, json_event)`

Decorate a socket and change the 'data' event to json_event.

```js
jsonsocket_mutate(socket, 'message');

socket.on('message', function(data) {
    console.log("This is JSON:", data)
});
```

### `jsonsocket_mutate.isJson(data)`

Helper function to check if data is an instance of Buffer or a JSON object.
Needed if json_event is left to 'data'.


## Events

Events are all from net.Socket, except for json_event if set.

If json_event is set, then the 'data' event will only receive raw Buffer objects, and the json_event event will receive the JSON object.

If json_event is not set, the 'data' event is fired twice. First with a Buffer object containing the raw stream data, and second with an instance of whatever object you sent to the socket.
In that case, it is necessary to check if data is a Buffer instance, or call jsonsocket_mutate.isJson(data) and exit accordingly.


## Protocol

Should be 100% compatible with [json-socket](https://www.npmjs.com/package/json-socket#how-the-protocol-works).

## TODO

Hopefully nothing. This decorator/mutator is meant to stay as simple as possible.
(ok, maybe some unit-tests).

