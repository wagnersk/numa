import { useSQLiteContext } from "expo-sqlite";

export type SessionUser = {
    id: number
}

export function useSessionDatabase() {
    const database = useSQLiteContext();

    async function save(userId: number) {
        await database.withTransactionAsync(async () => {
            // Garante que apenas uma sessão exista, apagando a anterior.
            await database.runAsync('DELETE FROM session');
            // Insere a nova sessão
            await database.runAsync('INSERT INTO session (user_id) VALUES (?)', userId);
        });
    }

    async function get() {
        const result = await database.getFirstAsync<{ user_id: number }>('SELECT user_id FROM session LIMIT 1');
        return result ? result.user_id : null;
    }

    async function clear() {
        await database.runAsync('DELETE FROM session');
    }

    return { save, get, clear };
}
