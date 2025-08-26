import { HomeHeader } from "@/components/HomeHeader";
import { Summary } from "@/components/Summary";
import { TargetGrid, TartgetGridProps } from "@/components/TargetGrid";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTargetStore } from "@/store/useTargetStore";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function Index(){

    const targetDatabase = useTargetDatabase()
    const { fetchTargetsByPercentage  } = useTargetStore();
    const [ targets, setTargets ] = useState<TartgetGridProps[]>([])
    const [ isFetching, setIsFetching ] = useState(true)
    const [ targetFocusedColor, setTargetFocusedColor ] = useState('')
    
    async function fetchData() {
      const targetDataPromise = fetchTargetsByPercentage(targetDatabase)
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
            targetFocusedColor={targetFocusedColor}
            />
            <Summary
 
            />
            <TargetGrid
              data={targets}
             onFocusChange={(color) => setTargetFocusedColor(color)}
              
              />
 
        </View>
    )
}