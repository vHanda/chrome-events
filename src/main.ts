import * as types from "./types";

function getTimezoneOffset() {
	// JS stores
	return (new Date()).getTimezoneOffset() * -1 / 60.0;
}

function createEvent(type, data) {
	return {
		type: types.type_to_string(type),
		t: Date.now(),
		tz: getTimezoneOffset(),
		data: data
	};
}

// FIXME: Connect each chrome.tabs events!
chrome.tabs.onActivated.addListener((activeInfo) => {
	var event = createEvent(types.EVENT_TYPE_TAB_ACTIVATED, activeInfo);
	sendEvent(event);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	var data = {
		tabId: tabId,
		changeInfo: changeInfo,
		tab: tab
	};
	var event = createEvent(types.EVENT_TYPE_TAB_UPDATED, data);
	sendEvent(event);
});

// FIXME: Connect each chrome.windows events!
chrome.windows.onFocusChanged.addListener((windowId) => {
	if (windowId == chrome.windows.WINDOW_ID_NONE) {
		var event = createEvent(types.EVENT_TYPE_WINDOW_FOCUS_LOST, null);
		sendEvent(event);
		return;
	}

	var event = createEvent(types.EVENT_TYPE_WINDOW_FOCUSED, windowId);
	sendEvent(event);
});


chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener((state) => {
	if (state == "idle") {
		var event = createEvent(types.EVENT_TYPE_IDLE_START, null);
	} else {
		var event = createEvent(types.EVENT_TYPE_IDLE_STOP, null);
	}
	sendEvent(event);
});
*/

function sendEvent(event: Event) {
	console.log("sendEvent", event.eventType, event.eventData);
	storage.save(event);
}

import { LocalStorage } from "./storage";
var storage = new LocalStorage();


// Notes:
// These events are not perfect and we will need additional events
// * Suspend Resume
// * X11 Window change


// Since I do need a local tracker for suspend/resume and for x11
// Perhaps I can just run a local webserver and send all the events there?
// That can have the append only log - use nedb-logger

function sendEventsToServer(events, cb) {
	const chromeEvents = {
		id: 'boo',
		events: events,
	};
	const url = "http://127.0.0.1:8080/chrome";
	fetch(url, {
		method: "POST",
		body: JSON.stringify(chromeEvents),
	}).then(response => {
		console.log(response.text);
		cb();
	}).catch(err => {
		console.log("Got an error", err);
		cb(err);
	});
}

function sync() {
	storage.getAll(events => {
		if (events.length == 0) {
			return;
		}

		console.log("Sending", events.length);
		sendEventsToServer(events, err => {
			if (err) {
				return;
			}
			storage.clear(() => { });
		});
	});
}

setTimeout(sync, 5000);
