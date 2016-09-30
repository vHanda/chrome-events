//
// Analytics
//

function timeSpentPerSite(events) {
	var domains = events.filter(e => e.data && e.data.url).map(e => extractDomain(e.data.url));
	domains = Array.from(new Set(domains));

	var finalResult = {};
	domains.forEach(domain => {
		// Converts each event into a event which says if we should start / stop
		// counting the time
		var domainEvents = events.map(e => {
			var ne = {
				time: e.time
			};

			if (e.type == EVENT_TYPE_TAB_ACTIVATED) {
				if (e.data) {
					var ed = extractDomain(e.data.url);
					if (ed == domain) {
						ne.start = true;
					} else {
						ne.stop = true;
					}
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

			/*
			// Temporarily disabling idle time as it just takes input into account
			// in order to generate the event. So when watching a video, after x
			// seconds, we no longer count that time as active, even though it is
			//
			if (e.type == EVENT_TYPE_IDLE_START) {
				if (!e.data || !e.data.tabs)
					return

				if (e.data.tabs.length != 1)
					return;

				var tab = e.data.tabs[0];
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

			if (e.type == EVENT_TYPE_IDLE_STOP) {
				if (!e.data || !e.data.tabs)
					return

				if (e.data.tabs.length != 1)
					return;

				var tab = e.data.tabs[0];
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
			*/

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

		finalResult[domain] = time;
	});

	return finalResult;
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
