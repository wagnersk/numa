// hooks/useTransactionsDatabase.ts
import { useSQLiteContext } from "expo-sqlite";

export type TransactionCreate = {
  target_id: number;
  amount: number;
  observation?: string | null;
};

export type TransactionUpdate = {
  target_id: number;
  amount?: number;
  observation?: string | null;
};

export type TransactionResponse = {
  id: number;
  target_id: number;
  amount: number;
  observation: string | null;
  created_at: string;
  updated_at: string;
};

export type Summary = {
  input: number;
  output: number;
};

export function useTransactionsDatabase() {
  const database = useSQLiteContext();

  async function create(data: TransactionCreate) {
    const statement = await database.prepareAsync(
      `INSERT INTO transactions (target_id, amount, observation)
       VALUES ($target_id, $amount, $observation)`
    );

    await statement.executeAsync({
      $target_id: data.target_id,
      $amount: data.amount,
      $observation: data.observation ?? null,
    });

    await statement.finalizeAsync();
  }

  async function remove(id: number) {
    await database.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
  }

  async function listByTargetId(id: number) {
    return database.getAllAsync<TransactionResponse>(
      `
      SELECT 
        id, target_id, amount, observation, created_at, updated_at
      FROM transactions
      WHERE target_id = ?
      ORDER BY created_at DESC
      `,
      [id]
    );
  }

  async function summary() {
    return database.getFirstAsync<Summary>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS input,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS output
      FROM transactions
      `
    );
  }
  
  async function listAll() {
    return database.getAllAsync<TransactionResponse>(
      `
      SELECT 
        id, target_id, amount, observation, created_at, updated_at
      FROM transactions
      ORDER BY datetime(created_at) DESC
      `
    );
}

  return { create, listByTargetId, remove, summary, listAll };
}