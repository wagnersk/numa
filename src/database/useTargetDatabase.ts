import { useSQLiteContext } from "expo-sqlite";
import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export type TargetCreate = {
    name:string;
    amount:number;
    currency:string;
    color:string;
    start_date:Date;
    end_date:Date;
}

export type TargetResponse = {
    id:number;
    name:string;

    amount:number;
    currency:string;
    color:string;
    
    start_date:number;
    end_date:number;
    
    created_at:Date;
    updated_at:Date;

    photo_url:string;

    current:number;
    percentage:number;
}


export function useTargetDatabase(){
    const database = useSQLiteContext()

    async function create(data:TargetCreate) {
        const statement = await database.prepareAsync(
            "INSERT INTO targets (name, amount, currency, color, start_date, end_date) values ($name, $amount, $currency, $color, $start_date, $end_date)"
        )
             const result = await statement.executeAsync({
                $name: data.name,
                $amount: data.amount,
                $currency: data.currency,
                $color: data.color,
                $start_date: data.start_date.getTime(),
                $end_date: data.end_date.getTime(),
            })

            await statement.finalizeAsync();

            return result.lastInsertRowId;
            
        }
  
      function listByPercentage(){
        return database.getAllAsync<TargetResponse>(`
            SELECT 
                targets.id,
                targets.name,
                targets.amount,
                targets.currency,
                targets.color,
                targets.start_date,
                targets.end_date,
                COALESCE (SUM(transactions.amount), 0) AS current,
                COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
                targets.created_at,
                targets.updated_at,
                photos.local_uri AS photo_url
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            LEFT JOIN photos ON targets.id = photos.target_id
            GROUP BY targets.id, targets.name, targets.amount, targets.currency, targets.color, targets.start_date, targets.end_date
            ORDER BY percentage DESC
            `)
    }
      function show(id:string){
        return database.getFirstAsync<TargetResponse>(`
            SELECT 
                targets.id,
                targets.name,
                targets.amount,
                targets.currency,
                targets.color,
                targets.start_date,
                targets.end_date,
                COALESCE (SUM(transactions.amount), 0) AS current,
                COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
                targets.created_at,
                targets.updated_at,
                photos.local_uri AS photo_url
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            LEFT JOIN photos ON targets.id = photos.target_id
            WHERE targets.id = ${id}
            `)
    }


    /* 
    
  
  function listByClosestTarget() {
    return database.getAllAsync<TargetResponse>(`
        SELECT
          targets.id,
          targets.name,
          targets.amount,
          COALESCE (SUM(transactions.amount), 0) AS current,
          COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
          targets.created_at,
          targets.updated_at
        FROM targets
        LEFT JOIN transactions ON targets.id = transactions.target_id
        GROUP BY targets.id, targets.name, targets.amount
        ORDER BY percentage DESC
      `)
  }

  function show(id: number) {
    return database.getFirstAsync<TargetResponse>(`
      SELECT
        targets.id,
        targets.name,
        targets.amount,
        COALESCE (SUM(transactions.amount), 0) AS current,
        COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
        targets.created_at,
        targets.updated_at
      FROM targets
      LEFT JOIN transactions ON targets.id = transactions.target_id
      WHERE targets.id = ${id}
    `)
  }

  async function update(data: TargetUpdate) {
    const statement = await database.prepareAsync(`
        UPDATE targets SET
          name = $name,
          amount = $amount,
          updated_at = current_timestamp
        WHERE id = $id
      `)

    statement.executeAsync({
      $id: data.id,
      $name: data.name,
      $amount: data.amount,
    })
  }

  async function remove(id: number) {
    await database.runAsync('DELETE FROM targets WHERE id = ?', id)
  }
    */

    return {  
        create,
        listByPercentage,
        show
     }
}