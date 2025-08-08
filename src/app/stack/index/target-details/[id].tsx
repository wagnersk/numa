import { router } from "expo-router";
import { TouchableOpacity, ImageBackground } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

const IMAGE_URL = "https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

import { styles } from "./styles";
import { colors } from "@/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import BlurViewTargetDetails from "@/app/stack/index/target-details/BlurViewTargetDetails";


export default function TargetDetail() {
    const params = useLocalSearchParams<{id: string}>();


    return (
          <ImageBackground
            source={{ uri: IMAGE_URL }}
            style={styles.container}
            resizeMode="cover"
        >
               <BlurView intensity={100} style={styles.backButon}>
                    <TouchableOpacity onPress={router.back}>
                        <AntDesign name="arrowleft" size={24} color={colors.white}/>
                    </TouchableOpacity>
               </BlurView>
              
               <BlurViewTargetDetails 
                    id={params.id}
                    />
                       
        </ImageBackground>
    );
}