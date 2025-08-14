import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

import { styles } from "./styles";
import { colors, fontFamily } from "@/theme";
import StaticCircularProgressComponent from "../StaticCircularProgressComponent";
import { TartgetGridProps } from "../TargetGrid";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";

type Props = {
    onPress: () => void;
    item: TartgetGridProps;
}

export default function BlurViewTargetMiniCard({ 
    onPress,
    item,
}: Props) {
    const params = useLocalSearchParams<{id: string}>();
    function handleDeleteTarget() {
        console.log("Delete target with ID:", params.id);
    }
    function handleEditTarget() {
        console.log("Edit target with ID:", params.id);
    }

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onPress}
        >
            <ImageBackground
                source={{ uri: getLocalPhotoUri(item.photo_file_name) }}
                style={styles.imageStyle}
                resizeMode="cover"
            >
                <View style={styles.squareBlurCircle1}>
                <StaticCircularProgressComponent
                    size={40}
                    width={4}
                    fill={item.percentage}
                    lineCap="round"
                    rotation={0}
                    tintColor={item.photo_color}
                    backgroundColor={colors.gray[100]}
                    textFontStyle={fontFamily.light}
                    fontSize={10}
                />
                </View>

                <BlurView
                    tint="light"
                    intensity={100}
                    style={styles.squareBlurCircle2}
                >
                    <View style={styles.textWrapper}>
                        <Text style={styles.targetGoal}>{item.name}</Text>
                    </View>
                </BlurView>
            </ImageBackground>
        </TouchableOpacity>
    );
}
