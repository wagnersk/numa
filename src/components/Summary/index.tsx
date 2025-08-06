import {  View ,Text} from "react-native"

import { styles } from "./styles"
import { colors } from "@/theme/colors"


export function Summary(){
    return ( 
        <View  
            style={styles.container}
            >
                <View
                    style={styles.infoWrapper}
                    >
                    <View style={[styles.valueWrapper,{alignItems:'flex-start'}]}>
                        <Text style={styles.value}>R$ 2.500</Text>
                        <Text style={styles.caption}>Total guardado</Text>
                    </View>
                    <View style={styles.valueWrapper}>
                        <Text style={styles.value}>3</Text>
                        <Text style={styles.caption}>Metas ativas</Text>
                    </View>
                </View>
            </View>
    )
}