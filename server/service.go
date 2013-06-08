package main

import (
	"net/http"
)

type Location struct {
	Latitude  float64 `json:"lat,omitempty"`
	Longitude float64 `json:"long,omitempty"`
}

type GetArgs struct {
	Max int `json:"max,omitempty"`
}

type GetResult struct {
	Points []Location `json:"points,omitempty"`
}

type LocationService struct{}

func (s *LocationService) Get(r *http.Request, args *GetArgs, result *GetResult) error {
	count := args.Max
	if count == 0 {
		// inf
		count = 100
	}
	for i := 0; i < count; i++ {
		result.Points = append(result.Points, Location{10, 20})
	}
	return nil
}
