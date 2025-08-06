import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
 
export default function TabsLayout(){
    return ( 
            <Tabs
               screenOptions={{
                                headerShown:false,
                                
                            }}
            >
                <Tabs.Screen
                        name='index'
                        options={{
                            title:'Home',
                            tabBarIcon: ({size,color}) => (
                                <MaterialIcons 
                                name="home"
                                size={size}
                                color={color}
                                  />
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
                            title:'Análise',
                            tabBarIcon: ({size,color}) => (
                                <MaterialIcons name="insert-chart" size={size} color={color} />
                            )
                        }}
                        />
                </Tabs>

    )
}