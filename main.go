package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/denisbrodbeck/machineid"
)

type ChromeEvents struct {
	Test string
}

func handlePost(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var events ChromeEvents
	err := decoder.Decode(&events)
	if err != nil {
		log.Fatal(err)
	}

	io.WriteString(w, "200 OK\n")
}

func main() {
	id, err := machineid.ID()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("MachineID:", id)

	http.HandleFunc("/chrome", handlePost)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// TODO
// 1. Validate the schema!
// 2. Where to save?
