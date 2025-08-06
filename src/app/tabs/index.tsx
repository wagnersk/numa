import { HomeHeader } from "@/components/HomeHeader";
import { Summary } from "@/components/Summary";
import { TargetGrid } from "@/components/TargetGrid";
import { fontFamily } from "@/theme";
import { router } from "expo-router";
import { useEffect } from "react";
import { View, Text, Button} from "react-native";

export default function Index(){

    const data ={
        label:'Wagner',
        greetings:'Boa Tarde'
    }

    const targetData =[
        {
        id:`0`,
        targetName:'Viagem para Santorini',
        percentage:12,
        photoUrl:''
       },
       {
        id:`1`,
        targetName:'Comprar meu carro novo',
        percentage:12,
        photoUrl:''
       },
       {
        id:`2`,
        targetName:'Mobiliar a casa',
        percentage:12,
        photoUrl:''
       },
       
    ]

 

    return (
        <View style={{ flex:1}}>
            <HomeHeader  
            data={data} 
            />
             <Summary />
             <TargetGrid
                data={targetData}
                />
        {/*     <Text style={{fontFamily:fontFamily.bold, fontSize:34}}>Hola Mundo</Text>
                <Button 
                    title='Configurações'
                    onPress={()=>{ router.navigate('/stack/settings')}
                    }
                />
                <Button 
                    title='TargetDetails'
                    onPress={()=>{ router.navigate('/stack/target-details/123')}}
                /> */}
        </View>
    )
}// 2025845135218
