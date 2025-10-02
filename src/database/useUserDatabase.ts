import { useSQLiteContext } from "expo-sqlite";

export type Language = 'pt-br' | 'en' | 'es';

export type UserCreate = {
  name: string;
  email: string;
  password: string;
  language: Language;
};

export type UserUpdate = {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  language?: Language;
};

export type User = {
  id: number;
  name: string;
  email: string;
  language: Language;
};

type UserWithPassword = User & { password: string };

export function useUserDatabase() {
  const database = useSQLiteContext();

  async function create(data: UserCreate) {
    const statement = await database.prepareAsync(
      'INSERT INTO users (name, email, password, language) VALUES ($name, $email, $password, $language)'
    );
    const result = await statement.executeAsync({
      $name: data.name,
      $email: data.email,
      $password: data.password,
      $language: data.language,
    });
    await statement.finalizeAsync();
    return result.lastInsertRowId;
  }

  async function update(data: UserUpdate) {
    const statement = await database.prepareAsync(`
      UPDATE users SET
        name = COALESCE($name, name),
        email = COALESCE($email, email),
        password = COALESCE($password, password),
        language = COALESCE($language, language),
        updated_at = current_timestamp
      WHERE id = $id
    `);
    await statement.executeAsync({
      $id: data.id,
      $name: data.name,
      $email: data.email,
      $password: data.password,
      $language: data.language,
    });
    await statement.finalizeAsync();
  }

  async function findByEmail(email: string) {
    return database.getFirstAsync<UserWithPassword>('SELECT * FROM users WHERE email = ?', [email]);
  }

  async function findById(id: number) {
    return database.getFirstAsync<User>('SELECT id, name, email, language FROM users WHERE id = ?', [id]);
  }

  async function remove(id: number) {
    await database.runAsync('DELETE FROM users WHERE id = ?', [id]);
  }

  return { create, update, findByEmail, findById, remove };
}