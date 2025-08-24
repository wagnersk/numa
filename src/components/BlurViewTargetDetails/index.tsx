import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from 'expo-blur';

import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from "./styles";
import { colors, fontFamily } from "@/theme";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TartgetGridProps } from "../TargetGrid";
import { formatTimestampDDMMYYYY } from "@/utils/formatTimestampDDMMYYYY";
import { router } from "expo-router";


export type Props = {
    id: string
    data:TartgetGridProps
    contrastColor:'black' | 'white'
}
 
export default function BlurViewTargetDetails({
        id, 
        data,
        contrastColor
     }:Props
    ) {
    function handleDeleteTarget() {
        console.log("Delete target with ID:", id);
    }
    function handleEditTarget() {
        console.log("Edit target with ID:", id);
        router.push(`/no-tabs/target/${id}`)
    }

    
    return (
               <View style={styles.container}>
                <View style={styles.squareBlurCircle1}>
                    <AnimatedCircularProgress
                        style={styles.animatedCircularProgress}
                        size={140}
                        width={6}
                        fill={data.percentage}
                        lineCap="round"
                        rotation={0}
                        tintColor={data.photo_color}
                        backgroundColor={contrastColor === 'white' ? colors.gray[100]: colors.gray[700]}
                          /*  backgroundColor={contrastColor === 'black' ? colors.red[400]: colors.green[400]}  */
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
                                {fill.toFixed(2)} %
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
                                <Text style={styles.targetGoal}>{data.name}</Text>
                        </View>

                        <View style={styles.targetContent}>
                            <View style={styles.targetInfoContent}>
                                <Text style={styles.targetTittle}>Saldo</Text>
                                <Text style={styles.targetValue}>{data.currency}</Text>
                            </View>
                            <View style={styles.targetInfoContent}>
                                <Text  style={styles.targetTittle}>Objetivo</Text>
                                <Text  style={styles.targetValue}>{data.target}</Text>
                            </View>
                        </View>

                        <View style={styles.targetContent}>
                            <View style={styles.targetInfoContent}>
                                <Text style={styles.targetTittle}>Início</Text>
                                <Text style={styles.targetValue}>{formatTimestampDDMMYYYY(data.start_date)}</Text>
                            </View>
                            <View style={styles.targetInfoContent}>
                                <Text  style={styles.targetTittle}>Fim</Text>
                                <Text style={styles.targetValue}>{formatTimestampDDMMYYYY(data.end_date)}</Text>
                            </View>
                        </View>

                        <View style={styles.targetContent}>
                            <TouchableOpacity   style={styles.buttonBorder} onPress={handleEditTarget}>
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
               </BlurView>
              </View>
                       
    );
}