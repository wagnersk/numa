import {  View ,Text,TouchableOpacity } from "react-native"
import { styles } from "./styles"
import { colors } from "@/theme/colors"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useEffect } from "react";

type Props = {
    onPress: () => void;
    gridMode: boolean;
}
export function ToogleButton({
    onPress,
    gridMode
}:Props){
    const trackWidth = 90;
    const circleWidth = 40; // largura do círculo
    const circleHeight = 28;
    const trackPadding = 2;
    const maxTranslateX = trackWidth - circleWidth - trackPadding * 2;



    const translateX = useSharedValue(0);

      const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        width: circleWidth,
        height: circleHeight,
        borderRadius: circleHeight / 2,
        position: 'absolute',
        left: trackPadding,
        top: trackPadding, // centraliza verticalmente com padding igual
        justifyContent: 'center',
        alignItems: 'center',
    }));

    useEffect(() => {
        translateX.value = withSpring(gridMode ? 0 : maxTranslateX );
    }, [gridMode, maxTranslateX, translateX]);

    return ( 
        <View style={styles.container}>
            <TouchableOpacity
                    onPress={onPress} activeOpacity={0.8}
                      style={[
                    styles.toggleTrack,
                    {
                        width: trackWidth,
                        height: circleHeight + trackPadding * 2,
                    },
                ]}
             >
                    {/* Animated Toggle Circle */}
                    <Animated.View style={[styles.toggleCircle, animatedCircleStyle]}/>

                    {gridMode ? 
                    <FontAwesome name="square" size={18} color="black" />
                    :
                    <FontAwesome name="square-o" size={20} color="black" />
                    }

                    {gridMode ? 
                     <Ionicons name="grid-outline" size={18} color="black" />
                     :
                     <Ionicons name="grid" size={18} color="black" />
                    }
            </TouchableOpacity>
        </View>
    )
}