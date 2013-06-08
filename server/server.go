package main

import (
	"log"
	"net/http"
)

const (
	allowedCORSOrigin   = "*"
	allowedCORSHeaders  = "X-Requested-With,Content-Type"
	LocationServiceName = "locationsvc"
)

// HTTP response wrapper
type ResponseWriter struct {
	status int
	http.ResponseWriter
}

func NewResponseWriter(w http.ResponseWriter) *ResponseWriter {
	return &ResponseWriter{0, w}
}

func (w *ResponseWriter) WriteHeader(status int) {
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}

// HTTP server wrapper
type Server struct {
	handler http.Handler
}

func NewServer(h http.Handler) *Server {
	return &Server{handler: h}
}

func (s *Server) SetHandler(h http.Handler) {
	s.handler = h
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rw := NewResponseWriter(w)
	w.Header().Set("Access-Control-Allow-Origin", allowedCORSOrigin)
	w.Header().Set("Access-Control-Allow-Headers", allowedCORSHeaders)
	s.handler.ServeHTTP(rw, r)
	log.Printf("%s %s %d\n", r.Method, r.URL.Path, rw.status)
}
