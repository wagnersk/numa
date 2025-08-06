import { router } from "expo-router";
import { View, Text, Button} from "react-native";

import { useLocalSearchParams } from "expo-router";

export default function ConfirmImage(){

    const params = useLocalSearchParams<{id: string}>()

    return (
        <View style={{ flex:1, justifyContent:'center' }}>
            <Text>ID: {params.id}</Text>

            <Button 
                title='Voltar'
                onPress={router.back}
             />
        </View>
    )
}