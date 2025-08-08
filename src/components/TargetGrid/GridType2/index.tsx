import {  View , FlatList } from "react-native"

import { styles } from "./styles"
import { TartgetGridProps } from ".."
import { router } from "expo-router"
import BlurViewTargetMiniCard from "@/components/BlurViewTargetMiniCard"

type Props = {
    data:TartgetGridProps[]
    
}

export function GridType2({data}:Props){
    console.log("renderizando GridType2 ");
    return ( 
            <FlatList
                contentContainerStyle={styles.flatListStyle}
                keyExtractor={(item) => item.id}
                numColumns={2} // 2 itens por linha
                columnWrapperStyle={{ gap: 24 }} // espaço entre colunas
                showsVerticalScrollIndicator={false}
                data={data}

                renderItem={({item})=>(
                    <BlurViewTargetMiniCard 
                    photoUrl={item.photoUrl}
                    targetName={item.targetName}
                    percentage={item.percentage}
                    id={item.id}
                    onPress={()=>{ router.navigate(`/stack/target-details/${item.id}`)}}
                    />
                )}
            >
             </FlatList>
    )
}