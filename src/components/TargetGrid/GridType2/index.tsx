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
                keyExtractor={(item) =>String(item.id)}
                numColumns={2} // 2 itens por linha
                columnWrapperStyle={{ gap: 24 }} // espaço entre colunas
                showsVerticalScrollIndicator={false}
                data={data}

                renderItem={({item})=>(
                    <BlurViewTargetMiniCard 
                    photo_url={item.photo_url}
                    targetName={item.name}
                    percentage={item.percentage}
                    id={String(item.id)}
                    onPress={()=>{ router.navigate(`/stack/target-details/${item.id}`)}}
                    />
                )}
            >
             </FlatList>
    )
}