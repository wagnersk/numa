import {  DimensionValue, View   } from "react-native"


import { ToogleButton } from "./toogleButton"
import { GridType1 } from "./GridType1"
import { GridType2 } from "./GridType2"
import { useState } from "react"
import { TargetsData } from "@/store/useTargetStore"

 
 
type Props = {
    data:TargetsData[]
   onFocusChange?: (id: string | null) => void; // callback opcional

}

export function TargetGrid({
    data,
    onFocusChange
}:Props){
    const [gridMode, setGridMode] = useState(true)


    function handleChangeGridMode() {
        setGridMode((prevMode) => !prevMode)
        
    }
  
    return ( 
            <View style={{ 
                flex:1 ,
                gap:48, 
                justifyContent:'flex-start',
                
                
            }}>
                <ToogleButton 
                onPress={handleChangeGridMode}
                gridMode={gridMode}
                />
                { 
                gridMode ? 
                <GridType1 data={data}
                 onFocusChange={(id) => onFocusChange(id)}

                 />
                :
                <GridType2 data={data} />
            }

                </View>
    )
}