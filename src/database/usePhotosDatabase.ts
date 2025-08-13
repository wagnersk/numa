// hooks/usePhotosDatabase.ts
import { useSQLiteContext } from "expo-sqlite";

export type PhotoCreate = {
  target_id: number;
  color: string;
  blur_hash: string;
  local_uri: string;
  direct_url: string;
};

export function usePhotosDatabase() {
  const database = useSQLiteContext();

  async function create(data: PhotoCreate) {
    const statement = await database.prepareAsync(
      `INSERT INTO photos (target_id, color, blur_hash, local_uri, direct_url)
       VALUES ($target_id, $color, $blur_hash, $local_uri, $direct_url)`
    );

    await statement.executeAsync({
      $target_id: data.target_id,
      $color: data.color,
      $blur_hash: data.blur_hash,
      $local_uri: data.local_uri,
      $direct_url: data.direct_url,
    });
  }

  return { create };
}