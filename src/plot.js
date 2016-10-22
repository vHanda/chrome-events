

var storage = new Storage();
storage.getAll(events => {
	console.log("get events", events.length)
	events = events.filter(e => {
		d = new Date(e.time);
		return d.toISOString().slice(0,10) == (new Date()).toISOString().slice(0,10)
	})
	console.log("filtered events", events.length)
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
