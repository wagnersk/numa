import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from 'expo-blur';

import { styles } from "./styles";
import { colors, fontFamily } from "@/theme";
import StaticCircularProgressComponent from "../StaticCircularProgressComponent";
import { TartgetGridProps } from "../TargetGrid";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
    onDetails: () => void;
    onInsertAmount: () => void;
    item: TartgetGridProps;
}

export default function BlurViewTargetMiniCard({ 
    onDetails,
    onInsertAmount,
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
        <View  style={styles.container}>

                <BlurView
                    tint="light"
                    intensity={800}
                    style={styles.openEditTarget}>
                       <TouchableOpacity activeOpacity={0.7} onPress={onDetails}>
                            <AntDesign name="arrows-alt" size={24} color="black" />
                    </TouchableOpacity>
                </BlurView>

            <ImageBackground
                source={{ uri: getLocalPhotoUri(item.photo_file_name) }}
                style={styles.imageStyle}
                resizeMode="cover"
            >
                <TouchableOpacity
                    style={styles.circleWrapper}
                    activeOpacity={0.7}
                    onPress={onInsertAmount}
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
                    style={styles.blueView}
                    >
                    <View style={styles.textWrapper}>
                        <Text style={styles.targetGoal}>{item.name}</Text>
                    </View>
                </BlurView>
                    </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}
