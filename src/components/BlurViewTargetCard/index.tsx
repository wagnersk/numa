import { View, Text, TouchableOpacity, ImageBackground, DimensionValue } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

import { styles } from "./styles";
import Entypo from '@expo/vector-icons/Entypo';
import { TartgetGridProps } from "../TargetGrid";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";

type Props = {
    onPress: () => void;
    width: number;
    focus?: boolean;
    item:TartgetGridProps
}

export default function BlurViewTargetCard({ 
    onPress,
    width,
    focus,
    item
}: Props) {
    const params = useLocalSearchParams<{id: string}>();
    function handleDeleteTarget() {
        console.log("Delete target with ID:", params.id);
    }
    function handleEditTarget() {
        console.log("Edit target with ID:", params.id);
    }
 
    return (
        <TouchableOpacity onPress={onPress}>
            <ImageBackground
                source={{ uri: getLocalPhotoUri(item.photo_file_name) }}
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
                                <Text style={styles.targetTittle}>{item.name}</Text>
                            </View>
                            <View style={styles.progressBackground}>
                                
                                <View style={{  overflow: 'hidden',
                                                borderRadius: 4,
                                                height: '100%',
                                                backgroundColor: item.photo_color,
                                                width: `${item.percentage}%`}}
                                                />
                            </View>

                            <View style={styles.textWrapper}>
                                <Text style={styles.targetGoal}>{item.percentage} %</Text>
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