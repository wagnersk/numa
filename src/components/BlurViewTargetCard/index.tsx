import { View, Text, TouchableOpacity, ImageBackground, DimensionValue } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

import { styles } from "./styles";
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
    onPress: () => void;
    photo_url: string;
    name: string;
    percentage: number;
    width: number;
    id: string;
    focus?: boolean;
}

export default function BlurViewTargetCard({ 
    onPress,
    photo_url,
    name,
    percentage,
    width,
    focus,
    id
}: Props) {
    const params = useLocalSearchParams<{id: string}>();
    function handleDeleteTarget() {
        console.log("Delete target with ID:", params.id);
    }
    function handleEditTarget() {
        console.log("Edit target with ID:", params.id);
    }
    console.log(`photo_url`,photo_url)


    return (
        <TouchableOpacity onPress={onPress}>
            <ImageBackground
                source={{ uri: photo_url }}
                style={[
                    styles.container,
                    {
                        width: width,
                        ...(focus && { height: 340, marginBottom: 8 }),

                    }]}
                resizeMode="cover"
            >
                <View style={styles.squareBlurCircle1}>
                </View>

                <BlurView
                    tint="light"
                    intensity={100}
                    style={styles.squareBlurCircle2}
                >
                    <View style={styles.textInfoWrapper}>
                        <View style={styles.textInfoLeftWrapper}>
                            <View style={styles.textWrapper}>
                                <Text style={styles.targetTittle}>{name}</Text>
                            </View>
                            <View style={styles.progressBackground}>
                                <View style={[styles.progressColor,{width: percentage as DimensionValue}]}/>
                            </View>

                            <View style={styles.textWrapper}>
                                <Text style={styles.targetGoal}>{percentage} %</Text>
                            </View>
                        </View>
                        <View style={styles.textInfoRightWrapper}>
                            <Text style={styles.targetGoal}>Aplicar</Text>
                            <Entypo name="chevron-right" size={14} color="black" />
                        </View>
                    </View>
                </BlurView>
            </ImageBackground>
        </TouchableOpacity>
    );
}