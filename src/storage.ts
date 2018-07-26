import idb from "idb";
import * as IDB from "idb";

import { Event } from "./schemas/Event";

export class EventStorage {
  db!: IDB.DB;

  async setup() {
    console.log("called setup");
    this.db = await idb.open("logdb", 1, upgradeDB => {
      console.log("Creating the object store");
      upgradeDB.createObjectStore("log", { keyPath: "ts" });
    });
  }

  async save(event: Event) {
    const tx = this.db.transaction("log", "readwrite");
    tx.objectStore("log").put(event);
    return tx.complete;
  }

  getAll(): Promise<Event[]> {
    const tx = this.db.transaction("log", "readonly");
    return tx.objectStore("log").getAll();
  }

  clear() {
    const tx = this.db.transaction("log", "readwrite");
    tx.objectStore("log").clear();
    return tx.complete;
  }
}
