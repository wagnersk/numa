import { fontFamily } from "@/theme";
import { router } from "expo-router";
import { useEffect } from "react";
import { View, Text, Button} from "react-native";

export default function Login(){
 

    return (
        <View style={{ flex:1, justifyContent:'center' }}>
            <Text style={{fontFamily:fontFamily.bold, fontSize:34}}>Login</Text>
                <Button 
                    title='Sign up'
                    onPress={()=>{ router.navigate('/auth/signup')}}
                />
        

        </View>
    )
}