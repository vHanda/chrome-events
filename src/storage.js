class Storage {
    constructor() {
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB
            || window.msIndexedDB || window.shimIndexedDB;

        var request = indexedDB.open("logdb", 1);
        request.onsuccess = () => {
            console.log("Database opened");
            this.db = request.result
        }
        request.onupgradeneeded = function (event) {
            this.db = request.result;
            if (event.oldVersion < 1) {
                console.log("Created the object store");
                var store = this.db.createObjectStore("log", { keyPath: "t" });
            }
        }
    }

    save(event) {
        // FIXME: Let's commit this every x seconds!
        var tx = this.db.transaction("log", "readwrite");
        var store = tx.objectStore("log");

        console.log("Saving", event);
        store.put(event)
    }

    // FIXME: This is shitty. It would be better to explicity specify a range!
    getAll(callback) {
        var tx = this.db.transaction("log", "readonly");
        var store = tx.objectStore("log");

        store.getAll().onsuccess = function (event) {
            var result = event.target.result;
            console.log("GOT " + result);
            callback(result);
        };
    }

    clear(callback) {
        callback = callback || function () { };

        const tx = this.db.transaction("log", "readwrite");
        const store = tx.objectStore("log");
        store.clear().onsuccess = event => {
            console.log("Cleared store", event);
            callback();
        }

        // FIXME: Handle errors!
    }
}
