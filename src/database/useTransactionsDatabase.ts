// hooks/useTransactionsDatabase.ts
import { useSQLiteContext } from "expo-sqlite";

export type TransactionCreate = {
  user_id: number;
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
      `INSERT INTO transactions (user_id, target_id, amount, observation)
       VALUES ($user_id, $target_id, $amount, $observation)`
    );

    await statement.executeAsync({
      $user_id: data.user_id,
      $target_id: data.target_id,
      $amount: data.amount,
      $observation: data.observation ?? null,
    });

    await statement.finalizeAsync();
  }

  async function remove(id: number, user_id: number) {
    await database.runAsync(`DELETE FROM transactions WHERE id = ? AND user_id = ?`, [id, user_id]);
  }

  async function listByTargetId(id: number, user_id: number) {
    return database.getAllAsync<TransactionResponse>(
      `
      SELECT 
        id, target_id, amount, observation, created_at, updated_at
      FROM transactions
      WHERE target_id = ? AND user_id = ?
      ORDER BY created_at DESC
      `,
      [id, user_id]
    );
  }

  async function summary(user_id: number) {
    return database.getFirstAsync<Summary>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS input,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS output
      FROM transactions
      WHERE user_id = ?
      `, [user_id]
    );
  }
  
  async function listAll(user_id: number) {
    return database.getAllAsync<TransactionResponse>(
      `
      SELECT 
        id, target_id, amount, observation, created_at, updated_at
      FROM transactions
      WHERE user_id = ?
      ORDER BY datetime(created_at) DESC
      `, [user_id]
    );
}
 
async function listAllDataByTargetsId(target_ids: number[], user_id: number) {
  if (target_ids.length === 0) return [];

  const placeholders = target_ids.map(() => "?").join(", ");
  const query = `
    SELECT 
      transactions.id,
      transactions.target_id,
      transactions.amount,
      transactions.observation,
      transactions.created_at,
      transactions.updated_at,

      targets.name AS target_name,
      targets.amount AS target_amount,
      targets.currency AS target_currency,
      targets.color AS target_color,
      targets.start_date AS target_start_date,
      targets.end_date AS target_end_date,

      photos.file_name AS photo_file_name,
      photos.color AS photo_color,
      photos.blur_hash AS photo_blur_hash,
      photos.direct_url AS photo_direct_url

    FROM transactions
    INNER JOIN targets ON transactions.target_id = targets.id
    LEFT JOIN photos ON targets.id = photos.target_id
    WHERE transactions.target_id IN (${placeholders}) AND transactions.user_id = ?
    ORDER BY datetime(transactions.created_at) DESC
  `;

  return database.getAllAsync<any>(query, [...target_ids, user_id]);
}
 

  return { create, listByTargetId, remove, summary, listAll, listAllDataByTargetsId };
}