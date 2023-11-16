---
title: "REST and gRPC in parallel"
date: 2021-05-14
tags: post
permalink: /rest-and-grpc-in-parallel
---

I love to use gRPC for inter-service communication since it is very efficient and often a good alternative to messaging solutions like Kafka. It utilizes Protobuf and HTTP2 which brings a lot of benefits such as strong typing, versioning and streaming.

Nevertheless, it is often the case that I also need to provide REST and/or GraphQL endpoints for other consumers.

A simple solution is to utilize [cmux](https://github.com/soheilhy/cmux), a library that allows to multiplex connections based on their payload. This way I can provide every protocol on the same TCP listener:

```shell
go get github.com/soheilhy/cmux
```

For implementing a lightweight REST API I recommend using [echo](https://github.com/labstack/echo):

```shell
go get github.com/labstack/echo/v4
```

Of course you will also need the gRPC dependencies:

```shell
go get google.golang.org/grpc
go get google.golang.org/protobuf
```

Assume we are inside the main function. Let us start with creating the default listener first:

```go
port := ":8000"

l, err := net.Listen("tcp", port)
if err != nil {
    log.Fatal(err)
}
```

Then we initialize the multiplexer:

```go
m := cmux.New(l)
grpcL := m.Match(cmux.HTTP2HeaderField("content-type", "application/grpc"))
httpL := m.Match(cmux.HTTP1Fast())
```

Based on the `content-type` header we use gRPC+HTTP/2 or as fallback the HTTP/1.1 listener.

First we create the gRPC server and service:

```go
grpcS := grpc.NewServer()
// some service based on your proto
```

And second the "normal" HTTP server, in my case a REST API with echo:

```go
e := echo.New()
// some middleware, routes and handlers
httpS := &http.Server{
    Handler: http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
        e.ServeHTTP(resp, req)
    }),
}
```

Then we run the respective protocol servers with the muxed listeners in go routines:

```go
go grpcS.Serve(grpcL)
go httpS.Serve(httpL)
```

And finally start serving:

```go
fmt.Printf("Listening on %s\n", port)
m.Serve()
```
