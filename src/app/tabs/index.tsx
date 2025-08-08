import { HomeHeader } from "@/components/HomeHeader";
import { Summary } from "@/components/Summary";
import { TargetGrid } from "@/components/TargetGrid";
import { View } from "react-native";

export type TartgetGridProps = {
        id: string;
        targetName: string;
        percentage: number;
        photoUrl: string;
}


export default function Index(){

    const data ={
        label:'Wagner',
        greetings:'Boa Tarde'
    }
 
    

    const targetData:TartgetGridProps[] =[
        {
        id:`0`,
        targetName:'Viagem para Santorini',//21
        percentage:22,
        photoUrl: "https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

       },
       {
        id:`1`,
        targetName:'Comprar carro novo',//18
        percentage:52,
        photoUrl: "https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
       },
       {
        id:`2`,
        targetName:'Mobiliar a casa',//15
        percentage:72,
        photoUrl: "https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
