// hooks/usePhotosDatabase.ts
import { useSQLiteContext } from "expo-sqlite";

export type PhotoCreate = {
  user_id: number;
  target_id: number;
  file_name: string;
  color: string;
  blur_hash: string;
  direct_url: string;
};

export type PhotoUpdate = {
  id: number; // This is target_id
  file_name?: string;
  color?: string;
  blur_hash?: string;
  direct_url?: string;
};

export function usePhotosDatabase() {
  const database = useSQLiteContext();

  async function create(data: PhotoCreate) {
    const statement = await database.prepareAsync(
      `INSERT INTO photos (user_id, target_id, file_name, color, blur_hash, direct_url)
       VALUES ($user_id, $target_id, $file_name, $color, $blur_hash, $direct_url)`
    );

    await statement.executeAsync({
      $user_id: data.user_id,
      $target_id: data.target_id,
      $file_name: data.file_name,
      $color: data.color,
      $blur_hash: data.blur_hash,
      $direct_url: data.direct_url,
    });

    await statement.finalizeAsync();
  }

  async function update(data: PhotoUpdate, user_id: number) {
    const statement = await database.prepareAsync(`
      UPDATE photos SET
        file_name = COALESCE($file_name, file_name),
        color = COALESCE($color, color),
        blur_hash = COALESCE($blur_hash, blur_hash),
        direct_url = COALESCE($direct_url, direct_url),
        updated_at = current_timestamp
      WHERE target_id = $id AND user_id = $user_id
    `);

    await statement.executeAsync({
      $id: data.id,
      $user_id: user_id,
      $file_name: data.file_name,
      $color: data.color,
      $blur_hash: data.blur_hash,
      $direct_url: data.direct_url,
    });

    await statement.finalizeAsync();
  }

  async function remove(target_id: number, user_id: number) {
    await database.runAsync(`DELETE FROM photos WHERE target_id = ? AND user_id = ?`, [target_id, user_id]);
  }

  return { create, update, remove };
}