package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/denisbrodbeck/machineid"
)

type ChromeEvent struct {
	Type string                 `json:"Type"`
	TZ   int64                  `json:"tz"`
	TS   int                    `json:"ts"`
	Data map[string]interface{} `json:"data"`
}

type ChromeEvents struct {
	MachineID string        `json:"machineID"`
	Events    []ChromeEvent `json:"events"`
}

func handlePost(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	decoder := json.NewDecoder(r.Body)

	var events ChromeEvents
	err := decoder.Decode(&events)
	if err != nil {
		log.Fatal(err)
	}
	for _, event := range events.Events {
		fmt.Println(event)
		appendEvent(event)
	}
	fmt.Println(events)

	io.WriteString(w, "200 OK\n")
}

func appendEvent(event ChromeEvent) {
	f, err := os.OpenFile("./data.jsonl", os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0600)
	if err != nil {
		panic(err)
	}

	defer f.Close()

	bytes, err := json.Marshal(event)
	if err != nil {
		panic(err)
	}
	bytes = append(bytes, '\n')

	if _, err = f.Write(bytes); err != nil {
		panic(err)
	}
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

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

// TODO
// 1. Validate the schema!
// 2. Where to save?
