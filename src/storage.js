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
