import { type SQLiteDatabase} from 'expo-sqlite'

export async function migrate(database: SQLiteDatabase) {

    try {
  await database.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'pt-br',
      created_at timestamp NOT NULL DEFAULT current_timestamp,
      updated_at timestamp NOT NULL DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      amount FLOAT NOT NULL,
      currency TEXT NOT NULL,
      color TEXT NOT NULL,
      start_date INTEGER NOT NULL,
      end_date INTEGER NOT NULL,

      created_at timestamp NOT NULL DEFAULT current_timestamp,
      updated_at timestamp NOT NULL DEFAULT current_timestamp,

      CONSTRAINT fk_users_targets
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount FLOAT NOT NULL,
      observation TEXT NULL,

      created_at timestamp NOT NULL DEFAULT current_timestamp,
      updated_at timestamp NOT NULL DEFAULT current_timestamp,

      CONSTRAINT fk_users_transactions
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_targets_transactions
      FOREIGN KEY (target_id) REFERENCES targets(id)
      ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_id INTEGER NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      color TEXT NOT NULL,
      blur_hash TEXT NOT NULL,
      direct_url TEXT NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp,
      updated_at timestamp NOT NULL DEFAULT current_timestamp,

      CONSTRAINT fk_users_photos
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT fk_targets_photos
      FOREIGN KEY (target_id) REFERENCES targets(id)
      ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS session (
      user_id INTEGER PRIMARY KEY NOT NULL,
      
      CONSTRAINT fk_users_session
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
    );
  `);

    await database.execAsync(`
        INSERT OR IGNORE INTO users (name, email, password, language)
        VALUES ('Apple Reviewer', 'test@apple.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'en');
      `);
  // senha: 123456 = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92 (sha256)
   console.log("✅ Migration concluída com sucesso");
  } catch (error: any) {
    console.error("❌ Erro na migration:", error.message);
    console.error(error);
  }
}