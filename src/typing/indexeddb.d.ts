// This method seesm to be missing in typescript 2.9.2
// This has been fixed in typescript 3.0
// https://github.com/Microsoft/TypeScript/issues/24724

interface IDBObjectStore {
  getAll(): IDBRequest;
}
