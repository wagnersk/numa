import { router } from "expo-router";
import { View, Text, Button} from "react-native";

export default function Analysis(){

    return (
        <View style={{ flex:1, justifyContent:'center' }}>
            <Text>Transações</Text>
                <Button 
                    title='Transações'
                    onPress={()=>{ router.navigate('/stack/analysis/transactions/144')}}
                />
           
        </View>
    )
}