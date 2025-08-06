import {  View , FlatList ,TouchableOpacity } from "react-native"

import { colors } from "@/theme/colors"
import { MaterialIcons } from '@expo/vector-icons'
import { styles } from "./styles"
import { TartgetGridProps } from ".."
import { router } from "expo-router"

type Props = {
    data:TartgetGridProps[]
    
}

export function GridType2({data}:Props){
    return ( 
        <View   
            style={styles.container}
            >
            <FlatList
                contentContainerStyle={styles.flatListStyle}
                keyExtractor={(item) => item.id}
                numColumns={2} // 2 itens por linha
                columnWrapperStyle={{ gap: 24 }} // espaço entre colunas
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={({item})=>(
                    <TouchableOpacity 
                     onPress={()=>{ router.navigate(`/stack/target-details/${item.id}`)}}
                    style={styles.targetItem}
                    />
                )}
            >
             </FlatList>
        </View>
    )
}