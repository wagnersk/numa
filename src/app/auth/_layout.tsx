import { Stack  } from "expo-router"
import { colors } from "@/theme"
 
export default function StackLayout(){
 
    return ( 
            <Stack
                screenOptions={{
                    headerShown:false,
                    contentStyle:{ backgroundColor: colors.white

                     }
                }}
            >
                <Stack.Screen name='login'  />
             </Stack>
 
    )
}