export interface IDBEventTarget extends EventTarget {
    result: IDBDatabase;
    transaction: IDBTransaction | null;
}
export interface DBVersionChangeEvent extends IDBVersionChangeEvent {
    target: IDBEventTarget;
}
export interface DBSuccessEvent extends Event {
    target: IDBEventTarget;
}
/**
 * Normal result fetch event target which contains the main result
 */
export interface IDBResultEventTarget extends EventTarget {
    result: IDBCursorWithValue | null | undefined | any;
}
export interface IDBResultEvent extends Event {
    target: IDBResultEventTarget;
}
