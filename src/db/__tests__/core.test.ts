import { describe, it, expect, beforeAll } from 'vitest';
import { initDB, DB_NAME } from '../core';
import 'fake-indexeddb/auto';

describe('DB Core', () => {
  it('should initialize the database with correct name', async () => {
    const db = await initDB();
    expect(db.name).toBe(DB_NAME);
  });
});
