/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabStatus".
 */
export type TabStatus = "loading" | "complete";

export interface TabSchema {
  [k: string]: any;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "Tab".
 */
export interface Tab {
  id: number;
  index: number;
  windowId: number;
  highlighted: boolean;
  active: boolean;
  pinned: boolean;
  url: string;
  title: string;
  incognito: boolean;
  audible: boolean;
  status: TabStatus;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabActivated".
 */
export interface TabActivated {
  activeInfo: ActiveInfo;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "ActiveInfo".
 */
export interface ActiveInfo {
  tabId: number;
  windowId: number;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabAttached".
 */
export interface TabAttached {
  tabId: number;
  attachInfo: AttachInfo;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "AttachInfo".
 */
export interface AttachInfo {
  newWindowId: number;
  newPosition: number;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabCreated".
 */
export interface TabCreated {
  tab: Tab;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabDetached".
 */
export interface TabDetached {
  tabId: number;
  detachInfo: DetachInfo;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "DetachInfo".
 */
export interface DetachInfo {
  oldWindowId: number;
  oldPosition: number;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabHighlighted".
 */
export interface TabHighlighted {
  windowId: number;
  tabIds: number[];
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabMoved".
 */
export interface TabMoved {
  tabId: number;
  moveInfo: MoveInfo;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "MoveInfo".
 */
export interface MoveInfo {
  windowId: number;
  fromIndex: number;
  toIndex: number;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabRemoved".
 */
export interface TabRemoved {
  tabId: number;
  removeInfo: RemoveInfo;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "RemoveInfo".
 */
export interface RemoveInfo {
  windowId: number;
  isWindowClosing: boolean;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "TabUpdated".
 */
export interface TabUpdated {
  tabId: number;
  changeInfo: ChangeInfo;
}
/**
 * This interface was referenced by `TabSchema`'s JSON-Schema
 * via the `definition` "ChangeInfo".
 */
export interface ChangeInfo {
  status?: string;
  url?: string;
  title?: string;
  pinned?: boolean;
  audible?: boolean;
}
