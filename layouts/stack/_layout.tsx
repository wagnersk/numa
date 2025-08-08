import { Suspense } from "react"
import { Stack, Tabs ,Slot} from "expo-router"
import { colors } from "@/theme"
import { MaterialIcons } from "@expo/vector-icons"

import {
    useFonts,
    Urbanist_700Bold,
    Urbanist_600SemiBold,
    Urbanist_500Medium,
    Urbanist_400Regular,
    Urbanist_300Light_Italic,
    Urbanist_300Light
} from "@expo-google-fonts/urbanist"
import { Loading } from "@/components/Loading"

/* 
import { SQLiteProvider } from "expo-sqlite"
import { migrate } from "@/database/migrate"
import { Loading } from "@/components/Loading"
 */

export default function RootLayout(){
    const [fontsLoaded] = useFonts({   
        Urbanist_700Bold,
        Urbanist_600SemiBold,
        Urbanist_500Medium,
        Urbanist_400Regular,
        Urbanist_300Light,
        Urbanist_300Light_Italic
    })

    if(!fontsLoaded) {
        return   <Loading /> 
    } 
 
    return ( 
            <Stack
                screenOptions={{
                    headerShown:false,
                    contentStyle:{ backgroundColor: colors.white }
                }}
            >
                <Stack.Screen name='index'  />
             </Stack>
 
    )
}