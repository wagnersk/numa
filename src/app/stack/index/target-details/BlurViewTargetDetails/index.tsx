import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from 'expo-blur';

import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from "./styles";
import { colors, fontFamily } from "@/theme";
import { AnimatedCircularProgress } from "react-native-circular-progress";


export type Props = {
    id: string
}

 
export default function BlurViewTargetDetails(
    { id }:Props
) {

    function handleDeleteTarget() {
        console.log("Delete target with ID:", id);

    }
    function handleEditTarget() {
        console.log("Edit target with ID:", id);
    }

    return (
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
                        delay={500}
                        >
                
                      {
                        (fill) => (
                            <BlurView
                                tint="light"
                                intensity={100}
                                style={styles.circleBlurBackgroud} 
                                >
                            <Text  style={[styles.circleBlurText,{fontSize:20,fontFamily:fontFamily.regular}]} > 
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
                    tint="light"
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
                            <TouchableOpacity  style={styles.buttonBorder} onPress={handleDeleteTarget}>
                                    <AntDesign name="delete" size={24} color={colors.black}/>
                            </TouchableOpacity>

                            <TouchableOpacity   style={styles.buttonBorder} onPress={handleEditTarget}>
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
               </BlurView>
              </View>
                       
    );
}