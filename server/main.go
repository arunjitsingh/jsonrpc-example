package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	rpc "github.com/gorilla/rpc/v2"
	jsonrpc "github.com/gorilla/rpc/v2/json2"
)

// flags
var (
	hostFlag = flag.String("host", "", "Host to serve on")
	portFlag = flag.String("port", "8080", "Port to run the server on")
)

func init() {
	s := rpc.NewServer()
	s.RegisterCodec(jsonrpc.NewCodec(), "application/json")
	s.RegisterService(new(LocationService), LocationServiceName)
	http.Handle("/rpc", NewServer(s))
}

func main() {
	flag.Parse()
	log.SetOutput(os.Stdout)
	http.ListenAndServe(fmt.Sprintf("%s:%s", *hostFlag, *portFlag), nil)
}
