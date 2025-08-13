import { StyleSheet } from "react-native"
import { colors, fontFamily } from "@/theme"
 
 
export const styles = StyleSheet.create({
    container : {
        borderRadius:20,
        overflow: 'hidden',
        height:300,
        backgroundColor: colors.white,
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
        height: 84,
        overflow: 'hidden',
        borderRadius: 20,
    },
        textWrapper: { 
        flexWrap: 'nowrap' ,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        
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
    targetTittle : {
        fontSize: 16,
        color: colors.black,
        fontFamily: fontFamily.medium,
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
    progressBackground : {
        borderRadius: 4,
        overflow: 'hidden',
        
        height: 4,
        width: '100%',
        backgroundColor: colors.gray[200],
    },
    progressColor : {
        overflow: 'hidden',
        borderRadius: 4,
        height: '100%',
        backgroundColor: colors.green[100],
    },textInfoWrapper : {
        flex:1,
        gap:16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    textInfoLeftWrapper : {
        flexDirection:'column',
        alignItems:'center',
        gap:8,
        flex:1,
    },textInfoRightWrapper : { 
        flexDirection:'row',
        alignItems:'center',
    },

})