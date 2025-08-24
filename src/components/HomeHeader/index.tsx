import { View ,Text, TouchableOpacity} from "react-native"

import { styles } from "./styles"
import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "@/theme";


export type HomeHeaderProps = {
    label: string
    greetings: string

}

type Props = {
    data:HomeHeaderProps
    targetFocusedColor:string
}

/* import Feather from '@expo/vector-icons/Feather'; */
export function HomeHeader({data,targetFocusedColor}:Props){
 
    return( 
        <View style={styles.container}>
      {/* Fundo translúcido */}
       {/*  <View
          style={[
            styles.absoluteFill,
            { backgroundColor: targetFocusedColor, opacity: 0.5 },
          ]}
          /> */}
     

  <LinearGradient
          colors={[`${targetFocusedColor}`, colors.gray[100]]} // CC = ~80% opacidade
          start={{ x: 0, y: 0 }} // início do gradiente
          end={{ x: 0, y: 1 }}   // fim do gradiente
          locations={[0.5, 1]} // começa forte só a partir de 30% da altura
          style={styles.absoluteFill}

  />
      {/* Conteúdo */}
      <View style={styles.infoWrapper}>
        <View>
          <Text style={styles.greetings}>{data.greetings}</Text>
          <Text style={styles.label}>{data.label}</Text>
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