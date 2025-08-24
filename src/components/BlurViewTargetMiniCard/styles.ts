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
       openEditTarget: { 
        position: 'absolute',
        zIndex: 1,
        right:8,
        top: 8 ,
        height:36,
        width:36,
        borderRadius:18,
        overflow:'hidden',
        justifyContent:'center',
        alignItems:'center'
    },
       squareBlurCircle1: { 
        alignItems:'flex-end',
          position: 'absolute',
        left: 0,
        right: 4,
        bottom: 0,
        top:-18,
        
    },
    circleWrapper: { 
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'box-none', // Permite que os toques passem para os elementos abaixo
        height: 56,
    },
    blueView: { 
        position: 'absolute',
        pointerEvents: 'box-none', // Permite que os toques passem para os elementos abaixo
        overflow: 'hidden',
        flex:1,
        width:'100%',
        height:'100%',

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