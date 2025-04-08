import low, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs';
import { User, Payment } from '../types';

interface Schema {
  users: User[];
  payments: Payment[];
}

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), '.data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create db.json file if it doesn't exist
const adapter = new FileSync<Schema>(path.join(dataDir, 'db.json'));
const db: LowdbSync<Schema> = low(adapter);

// Set default data structure
db.defaults({ users: [], payments: [] }).write();

export const getUserById = (id: string): User | undefined => {
  return db.get('users').find({ id }).value();
};

export const createUser = (user: User): User => {
  db.get('users').push(user).write();
  return user;
};

export const updateUser = (id: string, update: Partial<User>): User | undefined => {
  return db.get('users').find({ id }).assign(update).write();
};

export const isPremiumUser = (id: string): boolean => {
  const user = getUserById(id);
  return user?.isPremium === true;
};

export const recordPayment = (payment: Payment): Payment => {
  db.get('payments').push(payment).write();
  return payment;
};

export default db;