import { EventType } from "./EventType";

import {
  Tab,
  MutedInfoReason,
  TabCreated,
  TabActivated,
  TabUpdated,
  TabMoved,
  TabHighlighted,
  TabDetached,
  TabRemoved,
  TabAttached,
  MutedInfo
} from "./schemas/Tab";
import { WindowCreated, WindowRemoved, WindowFocused } from "./schemas/Window";
import { Event } from "./schemas/Event";
import { IdleState, IdleStateChanged } from "./schemas/Idle";

function getTimezoneOffset() {
  // JS stores
  return (new Date().getTimezoneOffset() * -1) / 60.0;
}

function createEvent(type: EventType, data: any): Event {
  return {
    ts: Date.now(),
    tz: getTimezoneOffset(),

    eventType: type,
    eventData: data,

    // FIXME!
    service: "chrome"
  };
}

chrome.tabs.onCreated.addListener(t => {
  // FIXME: How to resolve this default value!
  var reason: MutedInfoReason = "exntension";

  var r = t.mutedInfo ? t.mutedInfo.reason : "";
  if (r == "user") {
    reason = "user";
  } else if (r == "capture") {
    reason = "capture";
  } else if (r == "exntension") {
    reason = "exntension";
  }
  var mutedInfo: MutedInfo = {
    muted: t.mutedInfo ? t.mutedInfo.muted : false,
    reason: reason
  };

  var tab: Tab = {
    id: t.id,
    index: t.index,
    windowId: t.windowId,
    highlighted: t.highlighted,
    active: t.active,
    pinned: t.pinned,
    url: t.url,
    faviconUrl: t.favIconUrl,
    title: t.title,
    incognito: t.incognito,
    audible: t.audible,
    status: t.status == "loading" ? "loading" : "complete",
    discarded: t.discarded,
    autoDiscardable: t.autoDiscardable,
    mutedInfo: mutedInfo
  };
  var eventData: TabCreated = {
    tab: tab
  };

  var event = createEvent(EventType.TAB_ACTIVATED, eventData);
  sendEvent(event);
});

// FIXME: The tab?
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo, tab) => {
  var eventData: TabUpdated = {
    tabId: tabId,
    changeInfo: changeInfo
  };

  var event = createEvent(EventType.TAB_UPDATED, eventData);
  sendEvent(event);
});

chrome.tabs.onActivated.addListener(activeInfo => {
  var eventData: TabActivated = {
    activeInfo: activeInfo
  };

  var event = createEvent(EventType.TAB_ACTIVATED, eventData);
  sendEvent(event);
});

chrome.tabs.onMoved.addListener((tabId: number, moveInfo) => {
  var eventData: TabMoved = {
    tabId: tabId,
    moveInfo: moveInfo
  };

  var event = createEvent(EventType.TAB_MOVED, eventData);
  sendEvent(event);
});

chrome.tabs.onHighlighted.addListener(highlightInfo => {
  var data: TabHighlighted = {
    windowId: highlightInfo.windowId ? highlightInfo.windowId : 0,
    tabIds:
      typeof highlightInfo.tabs == "number"
        ? [highlightInfo.tabs]
        : highlightInfo.tabs
  };
  var event = createEvent(EventType.TAB_HIGHLIGHTED, data);
  sendEvent(event);
});

chrome.tabs.onDetached.addListener((tabId: number, detachInfo) => {
  var data: TabDetached = {
    tabId: tabId,
    detachInfo: detachInfo
  };
  var event = createEvent(EventType.TAB_DETACHED, data);
  sendEvent(event);
});

chrome.tabs.onAttached.addListener((tabId: number, attachInfo) => {
  var data: TabAttached = {
    tabId: tabId,
    attachInfo: attachInfo
  };
  var event = createEvent(EventType.TAB_ATTACHED, data);
  sendEvent(event);
});

chrome.tabs.onRemoved.addListener((tabId: number, removeInfo) => {
  var data: TabRemoved = {
    tabId: tabId,
    removeInfo: removeInfo
  };
  var event = createEvent(EventType.TAB_REMOVED, data);
  sendEvent(event);
});

//
// Window
//

chrome.windows.onCreated.addListener(window => {
  var data: WindowCreated = {
    window: window
  };
  var event = createEvent(EventType.WINDOW_CREATED, data);
  sendEvent(event);
});

chrome.windows.onRemoved.addListener((windowId: number) => {
  var data: WindowRemoved = {
    id: windowId
  };
  var event = createEvent(EventType.WINDOW_REMOVED, data);
  sendEvent(event);
});

chrome.windows.onFocusChanged.addListener((windowId: number) => {
  var data: WindowFocused = {
    id: windowId
  };

  var event = createEvent(EventType.WINDOW_FOCUSED, data);
  sendEvent(event);
});

//
// IDLE
//

var detectionInterval = 30;
chrome.idle.setDetectionInterval(detectionInterval);

chrome.idle.onStateChanged.addListener(state => {
  // Is there an easier way?
  var s: IdleState = "active";
  if (state == "active") {
    s = state;
  } else if (state == "idle") {
    s = state;
  } else if (state == "locked") {
    s = state;
  }

  var data: IdleStateChanged = {
    detectionInterval: detectionInterval,
    newState: s
  };
  var event = createEvent(EventType.IDLE, data);
  sendEvent(event);
});

function sendEvent(event: Event) {
  console.log("sendEvent", event.eventType, event.eventData);
  storage.save(event);
}

import { EventStorage } from "./storage";
var storage = new EventStorage();
storage.setup();

// Notes:
// These events are not perfect and we will need additional events
// * Suspend Resume
// * X11 Window change

// Since I do need a local tracker for suspend/resume and for x11
// Perhaps I can just run a local webserver and send all the events there?
// That can have the append only log - use nedb-logger

// FIXME: Convrt to an async function!
function sendEventsToServer(events: Event[], cb: any) {
  const chromeEvents = {
    machineID: "",
    events: events
  };
  const url = "http://127.0.0.1:8080/chrome";
  fetch(url, {
    method: "POST",
    body: JSON.stringify(chromeEvents)
  })
    .then(response => {
      console.log(response.text);
      cb();
    })
    .catch(err => {
      console.log("Got an error", err);
      cb(err);
    });
}

async function sync() {
  const events = await storage.getAll();
  if (events.length == 0) {
    return;
  }

  console.log("Sending", events.length);
  sendEventsToServer(events, async (err: Error) => {
    if (err) {
      return;
    }
    await storage.clear();
  });
}

setTimeout(sync, 5000);
