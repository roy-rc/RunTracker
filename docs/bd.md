// src/db/index.ts
import Dexie, { type Table } from 'dexie';
import type { Route, RunSession } from '../types';

export class RunTrackerDatabase extends Dexie {
  routes!: Table<Route, string>;
  sessions!: Table<RunSession, string>;

  constructor() {
    super('RunTrackerDB');
    this.version(1).stores({
      routes: 'id, title, createdAt, updatedAt',
      sessions: 'id, routeId, startedAt, status',
    });
  }
}

export const db = new RunTrackerDatabase();

// Generate UUIDs in the application. Deleting a route also deletes its sessions.
// Do not persist Google Routes geometry or distance results in IndexedDB.