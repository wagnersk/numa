import { View, Text, TouchableOpacity, ImageBackground, DimensionValue } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

import { styles } from "./styles";
import Entypo from '@expo/vector-icons/Entypo';
import { TartgetGridProps } from "../TargetGrid";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
    onDetails: () => void;
    onInsertAmount: () => void;
    width: number;
    focus?: boolean;
    item:TartgetGridProps
}

export default function BlurViewTargetCard({ 
    onDetails,
    onInsertAmount,
    width,
    focus,
    item
}: Props) {
    const params = useLocalSearchParams<{id: string}>();

     function handleEditTarget() {
        console.log("Edit target with ID:", params.id);
    }

    function handleInsertAmountTarget() {
        console.log("Delete target with ID:", params.id);
    }
 
 
 
    return (
        <View>

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
                <BlurView
                    tint="light"
                    intensity={800}
                    style={styles.squareBlurCircle1}>
                       <TouchableOpacity  activeOpacity={0.7} onPress={onDetails}>
                            <AntDesign name="arrows-alt" size={24} color="black" />
                    </TouchableOpacity>
                </BlurView>

                <BlurView
                    tint="light"
                    intensity={100}
                    style={styles.squareBlurCircle2}
                >
                    <TouchableOpacity
                     style={styles.textInfoWrapper}
                     onPress={onInsertAmount}
                      activeOpacity={0.7}
                     >
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
                    </TouchableOpacity>
                </BlurView>
            </ImageBackground>
        </View>
    );
}