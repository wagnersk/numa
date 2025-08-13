import { Suspense } from "react"
import { Stack} from "expo-router"
import {
    useFonts,
    Urbanist_700Bold,
    Urbanist_600SemiBold,
    Urbanist_500Medium,
    Urbanist_400Regular,
    Urbanist_300Light_Italic
} from "@expo-google-fonts/urbanist"

import { colors } from "@/theme"
import { Loading } from "@/components/Loading"
 
import { SQLiteProvider } from "expo-sqlite"
import { migrate } from "@/database/migrate"
 

export default function RootLayout(){

    const [fontsLoaded] = useFonts({   
         Urbanist_700Bold,
         Urbanist_600SemiBold,
         Urbanist_500Medium,
         Urbanist_400Regular,
         Urbanist_300Light_Italic
    })

    if(!fontsLoaded) {
        return <Loading /> 
    } 
 
    return ( 
    <Suspense fallback={<Loading />}>
        <SQLiteProvider databaseName="target.db" onInit={migrate} useSuspense>
              <Stack
                screenOptions={{
                    headerShown:false,
                    contentStyle:{ backgroundColor: colors.white }
                }}
                >
                    <Stack.Screen name='index'  />  
             </Stack>
        </SQLiteProvider>
    </Suspense>
 
    )
}