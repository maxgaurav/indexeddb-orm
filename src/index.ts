import {DB} from './db';
import {Migration} from "./migration";

declare global {
    interface Window {
        idb: {
            DB,
            Migration,
        }
    }
}

window.idb = {
    DB: DB,
    Migration: Migration
};




