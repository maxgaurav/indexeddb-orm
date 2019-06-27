export interface IDBEventTarget extends EventTarget {
  result: IDBDatabase,
  transaction: IDBTransaction | null
}

export interface DBVersionChangeEvent extends IDBVersionChangeEvent {
  target: IDBEventTarget
}

export interface DBSuccessEvent extends Event {
  target: IDBEventTarget
}
