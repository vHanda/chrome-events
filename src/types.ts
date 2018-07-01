var EVENT_TYPE_HISTORY_VISITED = 1;
var EVENT_TYPE_TAB_ACTIVATED = 2;
// data = tab
var EVENT_TYPE_TAB_UPDATED = 3;
// data.tab
//   id
//   index
//   active
//   audible
//   incognito
//   highlighted -?
//   mutedInfo.muted
//   windowId
//   title
//   url
// data.tabId
// changeInfo
var EVENT_TYPE_WINDOW_FOCUS_LOST = 4;
// none
var EVENT_TYPE_WINDOW_FOCUSED = 5;
// data.id
// data.state == maximized
// date.tabs
var EVENT_TYPE_IDLE_START = 6;
// tabs
var EVENT_TYPE_IDLE_STOP = 7;
// tabs

function type_to_string(type) {
	switch (type) {
		case EVENT_TYPE_HISTORY_VISITED:
			return "EVENT_TYPE_HISTORY_VISITED";
		case EVENT_TYPE_TAB_ACTIVATED:
			return "EVENT_TYPE_TAB_ACTIVATED";
		case EVENT_TYPE_TAB_UPDATED:
			return "EVENT_TYPE_TAB_UPDATED";
		case EVENT_TYPE_WINDOW_FOCUS_LOST:
			return "EVENT_TYPE_WINDOW_FOCUS_LOST";
		case EVENT_TYPE_WINDOW_FOCUSED:
			return "EVENT_TYPE_WINDOW_FOCUSED";
		case EVENT_TYPE_IDLE_START:
			return "EVENT_TYPE_IDLE_START";
		case EVENT_TYPE_IDLE_STOP:
			return "EVENT_TYPE_IDLE_STOP";
		default:
			return "UNKNOWN";
	}
}