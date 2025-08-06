import { StyleSheet, ViewStyle } from "react-native"
import { colors, fontFamily } from "@/theme"
import {  Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const blurHeight = height * 0.4; // 40% da tela

const squareBase: ViewStyle  = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    pointerEvents: 'box-none', // Permite que os toques passem para os elementos abaixo
}

export const styles = StyleSheet.create({
    container : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    backButon : {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        borderRadius: 50,
        overflow: 'hidden',
        },
    animatedCircularProgress : {
        position: 'absolute',
        top: -70, // metade para fora do BlurView
        right: 30,
        borderRadius: 70,
        borderColor: colors.white,
        },
    squareBlurCircle1: { 
        ...squareBase,
        height: blurHeight,
        zIndex: 2,
    },
    squareBlurCircle2: { 
        ...squareBase,
        zIndex: 1,
        height: blurHeight,
        overflow: 'hidden',
    },
    circleBlurBackgroud :  { 
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        },
    circleBlurText : {
        fontSize: 22,
        color: colors.black,
        fontFamily: fontFamily.regular
        },
    targetInfoWrapper : {
       flex:1,
       gap:16,
        },
    targetHeader : {
        width:'50%',
        flexWrap:'nowrap',
        },
    targetContent :{ 
        flexDirection: 'row',
        justifyContent: 'space-between',
        },
    targetInfoContent :{
        justifyContent:'flex-start',
        width:'33%',
  
        },
    targetGoal : {
        fontSize: 28,
        color: colors.black,
        fontFamily: fontFamily.regular
        },
    targetTittle : {
        fontSize: 16,
        color: colors.black,
        fontFamily: fontFamily.regular
        },
    targetValue : {
        fontSize: 24,
        color: colors.black,
        fontFamily: fontFamily.regular
        },
    buttonText : {
        fontSize: 20,
        color: colors.black,
        fontFamily: fontFamily.medium
        },
    buttonBorder : {
        borderWidth:2,
        borderColor:colors.black,
        borderRadius:24,
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        paddingHorizontal:60,
        

        },
})