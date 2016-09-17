
// TODO: Convert the timestamp into something a bit more parseable
chrome.history.onVisited.addListener((result) => {
	console.log("History", result);
});

// TODO: Add the timestamp of the event!
chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log("TabActivated", activeInfo);
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		console.log("Tab:", tab);
	})
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("Tab Updated:", tabId, changeInfo, tab);
});

// FIXME: Get more info about this event!
chrome.windows.onFocusChanged.addListener((windowId) => {
	if (windowId == chrome.windows.WINDOW_ID_NONE) {
		console.log("Lost focus");
		return;
	}

	console.log("Got focus on", windowId);
	chrome.windows.get(windowId, {populate: true}, (window) => {
		console.log("Window", window);
	});
});


// TODO: Add timestamp of event!
chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener((state) => {
	console.log("IdleState", state);
});

// How can one write this to disk?
