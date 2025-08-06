import { router } from "expo-router";
import { View, Text, Button} from "react-native";

export default function SelectImage(){

    return (
        <View style={{ flex:1, justifyContent:'center' }}>
            <Text>Selecionando a imagem</Text>
                <Button 
                    title='Selecionar a imagem'
                    onPress={()=>{ router.navigate('/stack/target/confirm-image/444')}}
                />
            <Button 
                title='Voltar'
                onPress={router.back}
             />
        </View>
    )
}