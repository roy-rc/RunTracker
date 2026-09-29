import Dexie, { type Table } from 'dexie'
import type { Coordinate } from './geo'

export type Checkpoint = { id: string; name: string; order: number; coordinate: Coordinate }
export type Route = { id: string; title: string; createdAt: number; updatedAt: number; checkpoints: Checkpoint[] }

class RunTrackerDatabase extends Dexie {
  routes!: Table<Route, string>
  constructor() {
    super('RunTrackerDB')
    this.version(1).stores({ routes: 'id, title, createdAt, updatedAt' })
  }
}

export const db = new RunTrackerDatabase()
