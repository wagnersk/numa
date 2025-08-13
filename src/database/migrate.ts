import { type SQLiteDatabase} from 'expo-sqlite'

export async function migrate(database:SQLiteDatabase){
    await database.execAsync(`
        PRAGMA foreign_keys = ON;
        
        CREATE TABLE IF NOT EXISTS targets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amount FLOAT NOT NULL,
            currency TEXT NOT NULL,
            color TEXT NOT NULL,
            start_date INTEGER NOT NULL,
            end_date INTEGER NOT NULL,

            created_at timestamp NOT NULL DEFAULT current_timestamp,
            updated_at timestamp NOT NULL DEFAULT current_timestamp
         );

        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target_id INTEGER NOT NULL,
            amount FLOAT NOT NULL,
            observation TEXT NULL,

            created_at timestamp NOT NULL DEFAULT current_timestamp,
            updated_at timestamp NOT NULL DEFAULT current_timestamp,

            CONSTRAINT fk_targets_transactions
            FOREIGN KEY (target_id) REFERENCES targets(id)
            ON DELETE CASCADE
         );
             
        CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target_id INTEGER NOT NULL,
            color TEXT NOT NULL,
            blur_hash TEXT NOT NULL,
            local_uri TEXT NOT NULL,
            direct_url TEXT NOT NULL,
            created_at timestamp NOT NULL DEFAULT current_timestamp,
            updated_at timestamp NOT NULL DEFAULT current_timestamp,

            CONSTRAINT fk_targets_photos
            FOREIGN KEY (target_id) REFERENCES targets(id)
            ON DELETE CASCADE
         );
        `)

}