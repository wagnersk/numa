import {  View , FlatList } from "react-native"

import { styles } from "./styles"
import { router } from "expo-router"
import BlurViewTargetMiniCard from "@/components/BlurViewTargetMiniCard"
import { TargetByPercentageProps } from "@/store/useTargetStore"


type Props = {
    data:TargetByPercentageProps[]
    
}

export function GridType2({data}:Props){
    return ( 
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.flatListStyle}
                keyExtractor={(item) =>String(item.id)}
                numColumns={2} // 2 itens por linha
                columnWrapperStyle={{ gap: 24 }} // espaço entre colunas
                showsVerticalScrollIndicator={false}
                data={data}
                
                renderItem={({item})=>(
                    <BlurViewTargetMiniCard 
                    item={item}
                    onDetails={()=>{ router.push(`/stack/target-details/${item.id}`)}}
                    onInsertAmount={()=>{   router.push(`/stack/target-insert-amount/${item.id}`)} }
                    />
                )}
                />
         </View>
    )
}