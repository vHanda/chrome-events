
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
storage.getAll(events => {
	var siteData = timeSpentPerSite(events);

    var x = [];
    var y = [];

    var keys = Object.keys(siteData);
    keys.sort();

    keys.forEach(key => {
        var val = siteData[key];
        x.push(key);
        y.push(val / 1000.0 / 60);
    });

    var data = [
        {
            x: y,
            y: x,
            type: 'bar',
            orientation: 'h',

        }
    ];
    Plotly.newPlot('tester', data);
});
