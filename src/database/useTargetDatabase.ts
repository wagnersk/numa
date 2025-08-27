import { CurrencyProps } from "@/utils/currencyList";
import { useSQLiteContext } from "expo-sqlite";

export type TargetCreate = {
    user_id: number;
    name:string;
    amount:number;
    currency:string;
    color:string;
    start_date:number;
    end_date:number;
}

  export type TargetUpdate = {
    id: number;
    name?: string;
    amount?: number;
    currency?: string;
    color?: string;
    end_date?: number;
  };

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

   
    photo_file_name:string;
    photo_color:string;
    photo_blur_hash:string;
    photo_direct_url:string;


    current:number;
    percentage:number;
}


export function useTargetDatabase(){
    const database = useSQLiteContext()

    async function create(data: TargetCreate) {
        const statement = await database.prepareAsync(
            "INSERT INTO targets (user_id, name, amount, currency, color, start_date, end_date) values ($user_id, $name, $amount, $currency, $color, $start_date, $end_date)"
        )
             const result = await statement.executeAsync({
                $user_id: data.user_id,
                $name: data.name,
                $amount: data.amount,
                $currency: data.currency,
                $color: data.color,
                $start_date: data.start_date,
                $end_date: data.end_date,
            })

            await statement.finalizeAsync();
            return result.lastInsertRowId;
            
        }
  
      function listByPercentage(user_id: number){
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
                photos.file_name AS photo_file_name,
                photos.color AS photo_color,
                photos.blur_hash AS photo_blur_hash,
                photos.direct_url AS photo_direct_url
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            LEFT JOIN photos ON targets.id = photos.target_id
            WHERE targets.user_id = ?
            GROUP BY targets.id, targets.name, targets.amount, targets.currency, targets.color, targets.start_date, targets.end_date
            ORDER BY percentage DESC
            `, [user_id])
    }
      function show(id: string, user_id: number){
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
                photos.file_name AS photo_file_name,
                photos.color AS photo_color,
                photos.blur_hash AS photo_blur_hash,
                photos.direct_url AS photo_direct_url
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            LEFT JOIN photos ON targets.id = photos.target_id
            WHERE targets.id = ? AND targets.user_id = ?
            `, [id, user_id])
     }
     
     function showAll(user_id: number) {
        return database.getAllAsync<TargetResponse>(`
            SELECT 
                targets.id,
                targets.name,
                targets.amount,
                targets.currency,
                targets.color,
                targets.start_date,
                targets.end_date,
                COALESCE(SUM(transactions.amount), 0) AS current,
                COALESCE((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
                targets.created_at,
                targets.updated_at,
                photos.file_name AS photo_file_name,
                photos.color AS photo_color,
                photos.blur_hash AS photo_blur_hash,
                photos.direct_url AS photo_direct_url
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            LEFT JOIN photos ON targets.id = photos.target_id
            WHERE targets.user_id = ?
            GROUP BY targets.id, targets.name, targets.amount, targets.currency, targets.color, targets.start_date, targets.end_date
            ORDER BY percentage DESC
        `, [user_id]);
      }
     function showAllByCurrency(currencyType: CurrencyProps, user_id: number) {
        return database.getAllAsync<TargetResponse>(`
            SELECT 
                targets.id,
                targets.name,
                targets.amount,
                targets.currency,
                targets.color,
                targets.start_date,
                targets.end_date,
                COALESCE(SUM(transactions.amount), 0) AS current,
                COALESCE((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
                targets.created_at,
                targets.updated_at,
                photos.file_name AS photo_file_name,
                photos.color AS photo_color,
                photos.blur_hash AS photo_blur_hash,
                photos.direct_url AS photo_direct_url
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            LEFT JOIN photos ON targets.id = photos.target_id
            WHERE targets.currency = ? AND targets.user_id = ?
            GROUP BY targets.id, targets.name, targets.amount, targets.currency, targets.color, targets.start_date, targets.end_date
            ORDER BY percentage DESC
        `, [currencyType, user_id]);
      }


       
        async function update(data: TargetUpdate, user_id: number) {
          const statement = await database.prepareAsync(`
            UPDATE targets SET
              name = COALESCE($name, name),
              amount = COALESCE($amount, amount),
              currency = COALESCE($currency, currency),
              color = COALESCE($color, color),
              end_date = COALESCE($end_date, end_date),
              updated_at = current_timestamp
            WHERE id = $id AND user_id = $user_id
          `);

          await statement.executeAsync({
            $id: data.id,
            $user_id: user_id,
            $name: data.name,
            $amount: data.amount,
            $currency: data.currency,
            $color: data.color,
            $end_date: data.end_date,
          });

          await statement.finalizeAsync();
        }

        async function remove(id: number, user_id: number) {
          await database.runAsync(`DELETE FROM targets WHERE id = ? AND user_id = ?`, [id, user_id]);
        }

        
 

    return {  
        create,
        listByPercentage,
        show,
        showAll,
        showAllByCurrency,
        update,
        remove
     }
}