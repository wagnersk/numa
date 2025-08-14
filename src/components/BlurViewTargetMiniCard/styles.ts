import { StyleSheet } from "react-native"
import { colors, fontFamily } from "@/theme"
 
 
export const styles = StyleSheet.create({
    container : {
        borderRadius:12,
        overflow: 'hidden',
    },
    imageStyle : {
        borderRadius:12,
        height:160,
        width:160,
    },
       squareBlurCircle1: { 
        position: 'absolute',
        zIndex: 1,
        right:8,
        bottom: 36,
        
    },
    squareBlurCircle2: { 
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'box-none', // Permite que os toques passem para os elementos abaixo
        height: 56,
        overflow: 'hidden',
    },
        textWrapper: { 
        width: '75%',
        flexWrap: 'nowrap' ,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    targetInfoWrapper : {
       flex:1,
       gap:16,
        },
    targetHeader : {
        },
   
    targetGoal : {
        fontSize: 14,
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