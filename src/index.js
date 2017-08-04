import { DB } from './db';
import { Migration } from "./migration";
window.idb = {
    DB: DB,
    Migration: Migration
};
