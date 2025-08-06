import { Suspense } from "react"
import { Stack, Tabs ,Slot} from "expo-router"
import { colors } from "@/theme"
import { MaterialIcons } from "@expo/vector-icons"

 

 
export default function TabsLayout(){
 
 
    return ( 
            <Tabs>
                <Tabs.Screen
                        name='index'
                        options={{
                            title:'Home',
                            tabBarIcon: ({size,color}) => (
                                <MaterialIcons name="home" size={size} color={color} />
                            )
                        }}
                        />
                    <Tabs.Screen
                        name='target'
                        options={{
                            title:'Metas',
                            tabBarIcon: ({size,color}) => (
                                <MaterialIcons name="add" size={size} color={color} />
                            )
                        }}
                        />
                    <Tabs.Screen
                        name='analysis'
                        options={{
                            title:'Metass',
                            tabBarIcon: ({size,color}) => (
                                <MaterialIcons name="insert-chart" size={size} color={color} />
                            )
                        }}
                        />
                </Tabs>
  
      
    /*     <Suspense fallback={<Loading />}>
            <SQLiteProvider
                databaseName="target.db"
                onInit={migrate}
                useSuspense
                >
                <Stack
                screenOptions={{
                    headerShown:false,
                    contentStyle:{ backgroundColor: colors.white }
                }}
                />
            </SQLiteProvider>
        </Suspense> */
    )
}