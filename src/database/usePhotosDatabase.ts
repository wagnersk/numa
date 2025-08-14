// hooks/usePhotosDatabase.ts
import { useSQLiteContext } from "expo-sqlite";

export type PhotoCreate = {
  blur_hash: string;
  color: string;
  direct_url: string;
  file_name: string;
  target_id: number;
};


export type PhotoUpdate = {
  id: number;
  blur_hash?: string;
  color?: string;
  direct_url?: string;
  file_name?: string;
};


export function usePhotosDatabase() {
  const database = useSQLiteContext();

  async function create(data: PhotoCreate) {
    const statement = await database.prepareAsync(
      `INSERT INTO photos (target_id, file_name, color, blur_hash, direct_url)
       VALUES ($target_id, $file_name, $color, $blur_hash, $direct_url)`
    );

    await statement.executeAsync({
      $blur_hash: data.blur_hash,
      $color: data.color,
      $direct_url: data.direct_url,
      $file_name: data.file_name,
      $target_id: data.target_id,
    });
  }


  async function update(data: PhotoUpdate) {
    const statement = await database.prepareAsync(`
      UPDATE photos SET
        file_name = COALESCE($file_name, file_name),
        color = COALESCE($color, color),
        blur_hash = COALESCE($blur_hash, blur_hash),
        direct_url = COALESCE($direct_url, direct_url)
      WHERE id = $id
    `);

    await statement.executeAsync({
      $id: data.id,
      $file_name: data.file_name,
      $color: data.color,
      $blur_hash: data.blur_hash,
      $direct_url: data.direct_url,
    });

    await statement.finalizeAsync();
  }

  async function remove(id: number) {
    await database.runAsync(`DELETE FROM photos WHERE id = ?`, [id]);
  }

  return { create, update, remove };
}