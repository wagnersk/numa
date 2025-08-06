import { router } from "expo-router";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

const IMAGE_URL = "https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { styles } from "./styles";
import { colors } from "@/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TargetDetail() {
    const params = useLocalSearchParams<{id: string}>();
 

    return (
          <ImageBackground
            source={{ uri: IMAGE_URL }}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
               <BlurView intensity={100} style={styles.backButon}>
                    <TouchableOpacity onPress={router.back}>
                        <AntDesign name="arrowleft" size={24} color={colors.white}/>
                    </TouchableOpacity>
               </BlurView>
              
               <View style={styles.container}>
                <View style={styles.squareBlurCircle1} >
                    <AnimatedCircularProgress
                        style={styles.animatedCircularProgress}
                        size={140}
                        width={6}
                        fill={29}
                        lineCap="round"
                        rotation={0}
                        tintColor={colors.green[100]}
                        backgroundColor={colors.gray[100]}
                     >
                        {
                            (fill) => (
                               <BlurView
                                    intensity={100}
                                    style={styles.circleBlurBackgroud} 
                                    >
                                <Text  style={styles.circleBlurText} > 
                                    { fill.toFixed(0) }%
                                </Text>
                            </BlurView>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>

               <BlurView
                    intensity={100}
                    style={styles.squareBlurCircle2} 
                    
                    >
                   <View style={styles.targetInfoWrapper}>
                        <View style={styles.targetHeader}>
                                <Text style={styles.targetGoal} >Viagem para Santorini</Text>
                        </View>

                        <View style={styles.targetContent}>
                            <View style={styles.targetInfoContent}>
                                <Text style={styles.targetTittle}>Saldo</Text>
                                <Text style={styles.targetValue}>R$ 2.000</Text>
                            </View>
                            <View style={styles.targetInfoContent}>
                                <Text  style={styles.targetTittle}>Objetivo</Text>
                                <Text  style={styles.targetValue}>R$ 15.000</Text>
                            </View>
                        </View>

                        <View style={styles.targetContent}>
                            <View style={styles.targetInfoContent}>
                                <Text style={styles.targetTittle}>Início</Text>
                                <Text style={styles.targetValue}>30/11/2024</Text>
                            </View>
                            <View style={styles.targetInfoContent}>
                                <Text  style={styles.targetTittle}>Fim</Text>
                                <Text style={styles.targetValue}>30/11/2025</Text>
                            </View>
                        </View>

                        <View style={styles.targetContent}>
                            <TouchableOpacity  style={styles.buttonBorder} onPress={router.back}>
                                    <AntDesign name="delete" size={24} color={colors.black}/>
                            </TouchableOpacity>

                            <TouchableOpacity   style={styles.buttonBorder} onPress={router.back}>
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
               </BlurView>
            </View>
                       
        </ImageBackground>
    );
}