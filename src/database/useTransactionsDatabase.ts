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


  return { create, remove };
}