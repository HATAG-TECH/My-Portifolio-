// server/models/jsonStore.js
import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';

class JSONStore {
  constructor() {
    this.dataDir = env.dataDir;
    this.contactsFile = path.join(this.dataDir, 'contacts.json');
    this.initialized = false;
  }

  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize contacts file if it doesn't exist
      try {
        await fs.access(this.contactsFile);
      } catch {
        await fs.writeFile(this.contactsFile, JSON.stringify([], null, 2));
      }
      
      this.initialized = true;
      console.log('✅ JSON store initialized');
    } catch (error) {
      console.error('❌ Failed to initialize JSON store:', error);
      throw error;
    }
  }

  async readContacts() {
    if (!this.initialized) await this.initialize();
    const data = await fs.readFile(this.contactsFile, 'utf-8');
    return JSON.parse(data);
  }

  async writeContacts(contacts) {
    if (!this.initialized) await this.initialize();
    await fs.writeFile(this.contactsFile, JSON.stringify(contacts, null, 2));
  }

  async addContact(contact) {
    const contacts = await this.readContacts();
    contacts.push(contact);
    await this.writeContacts(contacts);
    return contact;
  }

  async getContacts(limit = 50) {
    const contacts = await this.readContacts();
    return contacts.slice(-limit).reverse(); // Most recent first
  }
}

export const store = new JSONStore();
export const initializeStore = () => store.initialize();