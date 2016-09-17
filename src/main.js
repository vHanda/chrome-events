
var EVENT_TYPE_HISTORY_VISITED = 1;
var EVENT_TYPE_TAB_ACTIVATED = 2;
var EVENT_TYPE_TAB_UPDATED = 3;
var EVENT_TYPE_WINDOW_FOCUS_LOST = 4;
var EVENT_TYPE_WINDOW_FOCUSED = 5;
var EVENT_TYPE_IDLE_START = 6;
var EVENT_TYPE_IDLE_STOP = 7;

function createEvent(type, data) {
	return {
		type: type,
		time: Date.now(),
		data: data
	};
}

/*
// We do not really need the history right now!
// We can compute what we need with the tab + windows
chrome.history.onVisited.addListener((result) => {
	var event = createEvent(EVENT_TYPE_HISTORY_VISITED, result);
	sendEvent(event);
});
*/

chrome.tabs.onActivated.addListener((activeInfo) => {
	var event = createEvent(EVENT_TYPE_TAB_ACTIVATED, activeInfo);
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		event.data = tab;
		sendEvent(event);
	})
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	var data = {
		tabId: tabId,
		changeInfo: changeInfo,
		tab: tab
	};
	var event = createEvent(EVENT_TYPE_TAB_UPDATED, data);
	sendEvent(event);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
	if (windowId == chrome.windows.WINDOW_ID_NONE) {
		var event = createEvent(EVENT_TYPE_WINDOW_FOCUS_LOST, null);
		sendEvent(event);
		return;
	}

	var event = createEvent(EVENT_TYPE_WINDOW_FOCUSED, null);
	chrome.windows.get(windowId, {populate: true}, (window) => {
		event.data = window;
		event.data.tabs = event.data.tabs.filter(tab => tab.active);
		sendEvent(event);
	});
});


chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener((state) => {
	if (state == "idle") {
		var event = createEvent(EVENT_TYPE_IDLE_START, null);
	} else {
		var event = createEvent(EVENT_TYPE_IDLE_STOP, null);
	}
	chrome.tabs.query({active:true}, (tabs) => {
		event.data = {};
		event.data.tabs = tabs;
		sendEvent(event);
	})
});

function sendEvent(event) {
	storage.save(event);
}

class Storage {
	save(event) {
		var data = {};
		data[event.time] = event;
		chrome.storage.local.set(data);
	}

	getAll(callback) {
		chrome.storage.local.get(null, eventObj => {
			var events = [];
			// FIXME: use Object.values
			for (var key in eventObj) {
				events.push(eventObj[key]);
			}
			callback(events);
		});
	}
}

var storage = new Storage();
chrome.storage.local.getBytesInUse(null, bytes => {
	console.log("Storage Used:", bytes/1000.0/1000.0, "mb");
});


// Notes:
// These events are not perfect and we will need additional events
// * Suspend Resume
// * X11 Window change


// Since I do need a local tracker for suspend/resume and for x11
// Perhaps I can just run a local webserver and send all the events there?
// That can have the append only log - use nedb-logger

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('src/options.html'), 'selected': true});
});
