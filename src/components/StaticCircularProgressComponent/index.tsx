import { Text, View } from "react-native";
import { BlurView } from 'expo-blur';
import Svg, { Circle } from "react-native-svg";

import { styles } from "./styles";
import { colors } from "@/theme";

type Props = {
  size: number;
  width: number;
  fill: number; // de 0 a 100
  backgroundColor: string;
  tintColor: string;
  fontSize: number;
  textFontStyle: string;
  rotation: number; // padrão 0
  lineCap: "butt" | "square" | "round";
};

export default function ({
  size,
  width,
  fill,
  backgroundColor ,
  tintColor,
  fontSize,
  textFontStyle,
  rotation,
  lineCap 
}: Props) {
  const radius = (size - width) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * fill) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: `${rotation}deg` }] }}>
        {/* Fundo */}
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={width}
        />
        {/* Progresso */}
     <Circle
          stroke={tintColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={width}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap={lineCap}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />  
      </Svg>


      {/* Blur no centro */}
          <BlurView
          tint="light"
          intensity={100}
          style={[
            styles.circleBlurBackgroud,
            {
              position: "absolute",
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: (size * 0.8) / 2,
              justifyContent: "center",
              alignItems: "center",
              left: size * 0.1,
              top: size * 0.1
            }
          ]}
      >
        <Text
          style={{
            fontSize: fontSize,
            fontFamily: textFontStyle,
            color: colors.black,
          }}
        >
          {fill}
        </Text>
      </BlurView>
    </View>
  );
}