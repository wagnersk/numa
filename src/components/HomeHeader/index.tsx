import { View ,Text, TouchableOpacity} from "react-native"

import { styles } from "./styles"
import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "@/theme";


type Props = {
    greetings: string;
    label: string;
    targetFocusedColor: string;
}

export function HomeHeader({greetings, label, targetFocusedColor}:Props){
 
    return( 
        <View style={styles.container}>
      <LinearGradient
              colors={[`${targetFocusedColor}`, colors.gray[100]]} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 0, y: 1 }}  
              locations={[0.5, 1]}  
              style={styles.absoluteFill}

      />
      {/* Conteúdo */}
      <View style={styles.infoWrapper}>
        <View>
          <Text style={styles.greetings}>{greetings}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            router.navigate("/stack/settings");
          }}
        >
          <Feather name="settings" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    )
}