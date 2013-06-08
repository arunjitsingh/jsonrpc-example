# jsonrpc-example

An example of using JSON-RPC with [Go][golang], [Gorilla][jsonrpc] and
[AngularJS][angularjs]

### Running the server

Ensure that the `GOPATH` is set up.

    $ cd server
    $ go get
    $ go build -o build/server
    $ build/server --port=8000

### Running the app

    $ cd app
    $ bower install

Serve the `app/` directory from any HTTP server.

[golang]: https://code.google.com/p/go
[jsonrpc]: https://github/com/gorilla/rpc
[angularjs]: http://angularjs.org
