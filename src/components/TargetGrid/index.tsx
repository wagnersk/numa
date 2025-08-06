import {  View ,Text,TouchableOpacity  } from "react-native"

import { styles } from "./styles"
import { colors } from "@/theme/colors"
import { MaterialIcons } from '@expo/vector-icons'
import { ToogleButton } from "./toogleButton"
import { GridType1 } from "./GridType1"
import { GridType2 } from "./GridType2"
import { useState } from "react"


export type TartgetGridProps = {
        id: string;
        targetName: string;
        percentage: number;
        photoUrl: string;
}

 
type Props = {
    data:TartgetGridProps[]
}

export function TargetGrid({data}:Props){

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
            <GridType1 data={data} />
            :
            <GridType2 data={data} />
            }


                      
            </View>
    )
}