import {  View ,Text,TouchableOpacity } from "react-native"

import { styles } from "./styles"
import { colors } from "@/theme/colors"
 import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
 
type Props = {
    onPress: () => void;
    gridMode: boolean;
}
export function ToogleButton({
    onPress,
    gridMode

}:Props){

 

    return ( 
        <View style={styles.container}>
                        <TouchableOpacity
                        style={styles.toogle}
                        onPress={onPress}
               >
                     <View style={ gridMode ? styles.actived : styles.desactived}>
          
        

                    {gridMode ? 
                    <FontAwesome name="square" size={24} color="black" />
                    :
                    <FontAwesome name="square-o" size={26} color="black" />
                    }
                    </View>
                      
                       
                     <View style={ gridMode ? styles.desactived : styles.actived}>

                    {gridMode ? 
                     <Ionicons name="grid-outline" size={24} color="black" />
                        :
                     <Ionicons name="grid" size={24} color="black" />
                        }
 
                    </View>
                    </TouchableOpacity>
              </View>
    )
}