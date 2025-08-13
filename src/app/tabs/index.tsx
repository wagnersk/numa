import { HomeHeader } from "@/components/HomeHeader";
import { Summary } from "@/components/Summary";
import { TargetGrid, TartgetGridProps } from "@/components/TargetGrid";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";

export default function Index(){

    const [ targets, setTargets ] = useState<TartgetGridProps[]>([])
    const [ isFetching, setIsFetching ] = useState(true)
    const targetDatabase = useTargetDatabase()
   
     async function fetchTargets(): Promise<TartgetGridProps[]> {
            try {
              const response = await targetDatabase.listByPercentage()
              return response.map((item) => ({
                   id:Number(item.id),
                  target:numberToCurrency(item.amount),
                  currency: numberToCurrency(item.current),
                  color: item.color,
                  amount: item.amount,
                  end_date: item.end_date,
                  name: item.name,
                  percentage: Number(item.percentage.toFixed(2)),
                  current:item.current,
                  photo_url: item.photo_url,
                  start_date: item.start_date, 
              }))
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível carregar as metas.')
              console.log(error)
            }
          }
 
      
        async function fetchData() {
          const targetDataPromise = fetchTargets()
      
          const [targetData] = await Promise.all([
            targetDataPromise,
          ])
      
          setTargets(targetData)
      
          setIsFetching(false)
        }
      
        useFocusEffect(
          useCallback(() => {
            fetchData()
          }, []),
      )

    const data ={
        label:'Wagner',
        greetings:'Boa Tarde'
    }
 

    return (
        <View style={{ flex:1}}>
            <HomeHeader  
            data={data} 
            />
            <Summary />
            <TargetGrid
              data={targets}
              />
 
        </View>
    )
}