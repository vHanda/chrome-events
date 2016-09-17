
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
	sendEvent(event);
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
		chrome.storage.local.get(null, callback);
	}
}

var storage = new Storage();
storage.getAll(eventObj => {
	var events = [];
	// FIXME: use Object.values
	for (key in eventObj) {
		events.push(eventObj[key]);
	}
	timeSpentPerSite(events);
});

// Notes:
// These events are not perfect and we will need additional events
// * Suspend Resume
// * X11 Window change


// Since I do need a local tracker for suspend/resume and for x11
// Perhaps I can just run a local webserver and send all the events there?
// That can have the append only log - use nedb-logger

//
// Analytics
//
function timeSpentPerSite(events) {
	var domains = events.filter(e => e.data && e.data.url).map(e => extractDomain(e.data.url));
	domains = Array.from(new Set(domains));

	domains.forEach(domain => {
		// Converts each event into a event which says if we should start / stop
		// counting the time
		var domainEvents = events.map(e => {
			var ne = {
				time: e.time
			};

			if (e.type == EVENT_TYPE_TAB_ACTIVATED) {
				var ed = extractDomain(e.data.url);
				if (ed == domain) {
					ne.start = true;
				} else {
					ne.stop = true;
				}
			}

			if (e.type == EVENT_TYPE_WINDOW_FOCUSED) {
				var tabs = e.data.tabs;
				tabs.forEach(tab => {
					if (!tab.active) {
						return;
					}
					var td = extractDomain(tab.url);
					if (td == domain) {
						ne.start = true;
					} {
						ne.stop = true;
					}
				});
			}

			if (e.type == EVENT_TYPE_WINDOW_FOCUS_LOST) {
				ne.start = false;
			}

			if (e.type == EVENT_TYPE_TAB_UPDATED) {
				var tab = e.data.tab;
				if (!tab.active) {
					return;
				}

				var td = extractDomain(tab.url);
				if (td == domain) {
					ne.start = true;
				} else {
					ne.stop = true;
				}
			}

			// FIXME: Handle idle time!

			if (!ne.start && !ne.stop) {
				return;
			}
			return ne;
		});
		domainEvents = domainEvents.filter(e => e);

		var time = 0;
		var startTime = null;
		domainEvents.forEach(e => {
			if (e.start) {
				if (!startTime)
					startTime = e.time;
			} else {
				if (!startTime) {
					return;
				}

				time += (e.time - startTime);
				startTime = null;
			}
		});

		console.log(domain, time / 1000.0);
	});
}

function extractDomain(url) {
	var domain;
	//find & remove protocol (http, ftp, etc.) and get domain
	if (url.indexOf("://") > -1) {
		domain = url.split('/')[2];
	}
	else {
		domain = url.split('/')[0];
	}

	//find & remove port number
	domain = domain.split(':')[0];

	if (domain.indexOf('www.') == 0) {
		domain = domain.substr(4);
	}
	return domain;
}
