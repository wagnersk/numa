import { fontFamily } from "@/theme";
import { router } from "expo-router";
import { View, Text, Button} from "react-native";

export default function Signup(){

    return (
        <View style={{ flex:1, justifyContent:'center' }}>
            <Text style={{fontFamily:fontFamily.bold, fontSize:34}}>Signup</Text>
       
                <Button 
                    title='Voltar'
                    onPress={ router.back}
                />

        </View>
    )
}