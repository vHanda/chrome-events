

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
