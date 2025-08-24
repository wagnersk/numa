import {  
  View ,
  FlatList,
  Dimensions,
  TouchableOpacity
   } from "react-native"

import { styles } from "./styles"
 import { useEffect, useRef, useState } from "react"
import { Bullets } from "./bullets"
import { router } from "expo-router"
import { TartgetGridProps } from ".."
import BlurViewTargetCard from "@/components/BlurViewTargetCard"



type Props = {
    data:TartgetGridProps[]
    onFocusChange?: (id: string | null) => void; // callback opcional

    
}

export function GridType1({data,onFocusChange}:Props){
  const screenWidth = Dimensions.get('window').width;
  const ITEM_WIDTH = screenWidth * 0.7; // 70% da tela visível
  const SPACING = 16;
  const snapInterval = ITEM_WIDTH + SPACING;

    const [focusedId, setFocusedId] = useState<string | null>(null);

    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 70, // considera focado se 70% do item estiver visível
    }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        setFocusedId(viewableItems[0].item.id);
      }
    }).current;
    
    
 
     useEffect(() => {
    if (focusedId) {
      const focusedItem = data.find(item => item.id === Number(focusedId));
      const photoColor = focusedItem?.photo_color ?? null;

      // Envia o ID e a cor para o componente pai
      if (onFocusChange) {
        onFocusChange(photoColor); 
        // se quiser enviar também a cor, pode criar outro callback ou passar um objeto:
        // onFocusChange({ id: focusedId, color: photoColor });
      }
    }
  }, [focusedId, data, onFocusChange]); 
    return ( 
        <View   
            style={styles.container}
            >
            <View
              style={styles.listWrapper}
            >

            <FlatList
              contentContainerStyle={{
                paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2, // centraliza primeiro e último
                gap: SPACING,
                alignItems: 'flex-end',
                }}            
                keyExtractor={(item) =>String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={({item})=>(
                  <BlurViewTargetCard
                  item={item}
                  key={item.id}
                  width={ITEM_WIDTH}
                  focus={String(focusedId) === String(item.id)}
                  onDetails={()=>{ router.push(`/stack/target-details/${item.id}`)}}
                  onInsertAmount={()=>{   router.push(`/stack/target-insert-amount/${item.id}`)} }
                  />
                )}
                snapToInterval={snapInterval} // trava a rolagem
                decelerationRate="fast"
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
             />
            </View>
              <Bullets 
                data={data}
                focusedId={focusedId}
              />
        </View>
    )
}