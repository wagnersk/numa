        import { Stack  } from "expo-router"
        import { colors } from "@/theme"
        
        export default function StackLayout(){
        
            return ( 
                    <Stack
                        screenOptions={{
                            headerShown:false,
                         
                        }}
                    >
                        <Stack.Screen name='settings'  />

                        <Stack.Screen name="analysis/transactions" />

                        <Stack.Screen name="index/target-details/[id]" />
                        <Stack.Screen name="index/target-insert-amount/[id]" />
                        
                        <Stack.Screen name="target/select-image" />
                        <Stack.Screen name="target/select-color" />
                        <Stack.Screen name="target/confirm-image/[id]" />
     
                    </Stack>
        
            )
        }