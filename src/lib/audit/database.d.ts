import type { ClientRecord } from "./types";
export function initializeDatabase(): Promise<IDBDatabase>;
export function readyDatabase(): Promise<IDBDatabase>;
export function saveClientRecord(record: ClientRecord): Promise<number>;
export function getAllClientRecords(): Promise<ClientRecord[]>;
export function deleteClientById(id: number): Promise<boolean>;
export function clearAllClients(): Promise<boolean>;
export function getClientCount(): Promise<number>;
