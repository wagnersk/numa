import { HomeHeader } from "@/components/HomeHeader";
import { StartGrid } from "@/components/StartGrid";
import { Summary } from "@/components/Summary";
import { TargetGrid } from "@/components/TargetGrid";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTranslations } from "@/libs/i18n";
import { useUserStore } from "@/store/useUserStore";
import {
  TargetByPercentageProps,
  useTargetStore,
} from "@/store/useTargetStore";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";

export default function Index(){
    const targetDatabase = useTargetDatabase()
    const { fetchTargetsByPercentage  } = useTargetStore();
    const [ targets, setTargets ] = useState<TargetByPercentageProps[]>([])
    const [ isFetching, setIsFetching ] = useState(true)
    const [ targetFocusedColor, setTargetFocusedColor ] = useState('')
    
    const t = useTranslations();
    const { user } = useUserStore();

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

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return t.greetings.morning;
      if (hour < 18) return t.greetings.afternoon;
      return t.greetings.evening;
    };

     return (
        <View style={{ flex:1}}>
            <HomeHeader  
              greetings={getGreeting()}
              label={user?.name.split(" ")[0] || ""}
              targetFocusedColor={targetFocusedColor}
            />

          {targets && targets.length > 0 ?(
            <>
            <Summary/>
            <TargetGrid
              data={targets}
              onFocusChange={(color) => setTargetFocusedColor(color)}
              />
              </>
          ) :(
            <StartGrid />
          )}
        </View>
    )
}