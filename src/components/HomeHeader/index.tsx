import { View ,Text, TouchableOpacity} from "react-native"

import { styles } from "./styles"
 import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";


export type HomeHeaderProps = {
    label: string
    greetings: string
}

type Props = {
    data:HomeHeaderProps
}

/* import Feather from '@expo/vector-icons/Feather'; */
export function HomeHeader({data}:Props){
    return( 
        <View  
            style={styles.container}
            >
                <View
                    style={styles.infoWrapper}
                    >
                    <View>
                        <Text style={styles.greetings}>{data.greetings}</Text>
                        <Text style={styles.label}>{data.label}</Text>
                    </View>


                    <TouchableOpacity
                        style={styles.iconContainer}
                          onPress={()=>{ router.navigate('/stack/settings')}}
                    >
                        <View>

                        <Feather name="settings" size={32} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
    )
}