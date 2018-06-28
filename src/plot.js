
function msToDate(msecs) {
    return new Date(msecs).toISOString().slice(0, 10);
}

var storage = new Storage();
setTimeout(function () {
    storage.getAll(events => {
        console.log("get events", events.length)
        var today = msToDate(Date.now())
        events = events.filter(e => msToDate(e.t) == today)
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
}, 100);
