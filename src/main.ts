import * as types from "./types";

import { Tab, TabCreated, ActiveInfo, TabActivated } from "./schemas/Tab";
import { Window } from "./schemas/Window";
import { Event } from "./schemas/Event";

function getTimezoneOffset() {
	// JS stores
	return (new Date()).getTimezoneOffset() * -1 / 60.0;
}

function createEvent(type: Number, data): Event {
	return {
		ts: Date.now(),
		tz: getTimezoneOffset(),

		eventType: types.type_to_string(type),
		eventData: data,

		// FIXME!
		service: "chrome",
		machineID: "1",
	}
}

chrome.tabs.onCreated.addListener((t) => {
	var tab: Tab = {
		id: t.id,
		index: t.index,
		windowId: t.windowId,
		highlighted: t.highlighted,
		active: t.active,
		pinned: t.pinned,
		url: t.url,
		title: t.title,
		incognito: t.incognito,
		audible: t.audible,
		status: t.status == 'loading' ? "loading" : "complete",
	}
	var eventData: TabCreated = {
		tab: tab,
	};

	var event = createEvent(types.EVENT_TYPE_TAB_ACTIVATED, eventData);
	sendEvent(event);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	var eventData: TabActivated = {
		activeInfo: activeInfo,
	};

	var event = createEvent(types.EVENT_TYPE_TAB_ACTIVATED, eventData);
	sendEvent(event);
});

/*
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

import { EventStorage } from "./storage";
var storage = new EventStorage();


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
