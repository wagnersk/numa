import { router } from "expo-router";
import { View, Text, Button} from "react-native";

export default function SelectColor(){

    return (
        <View style={{ flex:1, justifyContent:'center' }}>
            <Text>Selecionando a cor</Text>
 

            <Button 
                title='Voltar'
                onPress={router.back}
             />
        </View>
    )
}