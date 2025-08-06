import { router } from "expo-router";
import { View, Text, Button} from "react-native";

export default function Target(){

    return (
        <View style={{ flex:1, justifyContent:'center' }}>
            <Text>Meta</Text>

                <Button 
                    title='Selecionar a cor'
                    onPress={()=>{ router.navigate('/stack/target/select-color')}}
                />
                <Button 
                    title='Selecionar a imagem'
                    onPress={()=>{ router.navigate('/stack/target/select-image')}}
                />

          
        </View>
    )
}