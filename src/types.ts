export var EVENT_TYPE_HISTORY_VISITED = 1;
export var EVENT_TYPE_TAB_ACTIVATED = 2;
export var EVENT_TYPE_TAB_UPDATED = 3;
export var EVENT_TYPE_WINDOW_FOCUSED = 5;
export var EVENT_TYPE_IDLE_START = 6;
export var EVENT_TYPE_IDLE_STOP = 7;
export var EVENT_TYPE_TAB_MOVED = 9;
export var EVENT_TYPE_TAB_HIGHLIGHTED = 10;
export var EVENT_TYPE_TAB_DETACHED = 11;
export var EVENT_TYPE_TAB_ATTACHED = 12;
export var EVENT_TYPE_TAB_REMOVED = 13;;
export var EVENT_TYPE_WINDOW_CREATED = 14;

export function type_to_string(type) {
	switch (type) {
		case EVENT_TYPE_HISTORY_VISITED:
			return "EVENT_TYPE_HISTORY_VISITED";
		case EVENT_TYPE_TAB_ACTIVATED:
			return "EVENT_TYPE_TAB_ACTIVATED";
		case EVENT_TYPE_TAB_UPDATED:
			return "EVENT_TYPE_TAB_UPDATED";
		case EVENT_TYPE_WINDOW_FOCUSED:
			return "EVENT_TYPE_WINDOW_FOCUSED";
		case EVENT_TYPE_IDLE_START:
			return "EVENT_TYPE_IDLE_START";
		case EVENT_TYPE_IDLE_STOP:
			return "EVENT_TYPE_IDLE_STOP";
		case EVENT_TYPE_TAB_MOVED:
			return "EVENT_TYPE_TYPE_MOVED";
		case EVENT_TYPE_TAB_HIGHLIGHTED:
			return "EVENT_TYPE_TYPE_HIGHLIGHTED";
		case EVENT_TYPE_TAB_DETACHED:
			return "EVENT_TYPE_TYPE_DETACHED";
		case EVENT_TYPE_TAB_ATTACHED:
			return "EVENT_TYPE_TYPE_ATACHED";
		case EVENT_TYPE_TAB_REMOVED:
			return "EVENT_TYPE_TAB_REMOVED";
		case EVENT_TYPE_WINDOW_CREATED:
			return "EVENT_TYPE_TAB_REMOVED";
		default:
			return "UNKNOWN";
	}
}
