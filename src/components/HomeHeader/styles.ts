import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/theme"

export const styles = StyleSheet.create({
    container : {
        width:"100%",
        height:156,
        justifyContent:'flex-end',
        
    },
      absoluteFill: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity:0.5
    },
     infoWrapper : {
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'space-between',
        padding:24,
    },
     greetings : {
        fontSize: 24,
        color: colors.black,
        fontFamily: fontFamily.regular
    },
    label : {
        fontSize: 40,
        color: colors.black,
        fontFamily: fontFamily.medium
    },
    iconContainer : {
        height:48,
        width:48,
    },
 })